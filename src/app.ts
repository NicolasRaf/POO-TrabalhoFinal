import { Categories } from "./enum/categories";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile, Post } from "./models";
import { OptionsPhoto } from "./enum/photos";
import { input, DataReader, DataSaver, pressEnter } from "./utils";

export class App {
    private _socialMedia: SocialMedia;
    private _currentUser?: Profile;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._registerActions(); 
        this._menu = new Menu(Categories.Aut);

        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        const actions = [
            { name: "Listar todos os perfis", category: Categories.Princ, action: () => this._socialMedia.listProfiles() },
            { name: "Listar perfis com nome 'José'", category: Categories.Princ, action: () => this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) },
            { name: "Cadastro", category: Categories.Aut, action: () => this.register() },
            { name: "Login", category: Categories.Aut, action: () => this.login() },
            { name: "Carregar dados", category: Categories.Princ, action: () => this.loadData() }
        ];

        actions.forEach(({ name, category, action }) => {
            ActionDispatcher.registerAction(name, category, action);
        });
    }

    public run(): void {
        this._menu.start();
    }

    public login(): void {
        const email = input("Email: ");
        const password = input("Senha: ");
        let user: Profile;

        try {
            user = this._socialMedia.searchProfile(email)[0];
            if (user.password !== password) throw new IncorrctPasswordError("Senha incorreta.");

            this._currentUser = user;
            this._menu.selectCategory(Categories.Princ); 
        } catch (error) {
            console.error((error as ApplicationError).message);
            this._menu.selectCategory(Categories.Aut); 
        }
    }

    public register(): void {
        let username: string;
        do {
            username = input("Nome de usuário: ").trim();
            if (!username) console.log("O nome de usuário não pode estar vazio. Tente novamente.");
        } while (!username);

        let email: string;
        do {
            email = input("Email: ").trim();
            if (!email) console.log("O email não pode estar vazio. Tente novamente.");
        } while (!email);

        let password: string;
        do {
            password = input("Senha: ").trim();
            if (!password) console.log("A senha não pode estar vazia. Tente novamente.");
        } while (!password);

        const status: boolean = true;
        const friends: Profile[] = [];
        const posts: Post[] = [];

        try {
            try {
                let user = this._socialMedia.searchProfile(email)[0];
                throw new ApplicationError("Email já cadastrado.");
            } catch (error) {
                if (error instanceof NotFoundError) {
                } else {
                    throw error;
                }
            }

            const id = this.gerarId();

            let photo: string | undefined = undefined;
            while (!photo) { 
                console.log("Escolha uma foto de perfil:");
                Object.values(OptionsPhoto).forEach((emoji, index) => {
                    console.log(`${index + 1}. ${emoji}`);
                });

                const photoChoice = parseInt(input("Escolha o número da foto: "));
                if (photoChoice >= 1 && photoChoice <= Object.values(OptionsPhoto).length) {
                    photo = Object.values(OptionsPhoto)[photoChoice - 1];
                } else {
                    console.log("Opção inválida. Tente novamente.");
                }
            }

            let user = new Profile(id, username, photo, email, password, status, friends, posts);

            this._socialMedia.addProfile(user);

            console.log("Usuário registrado com sucesso!");
            pressEnter();
            this._menu.selectCategory(Categories.Princ);
        } catch (error) {
            console.error("Erro ao registrar usuário: " + (error as ApplicationError).message);
        }
    }

    public gerarId(): string {
        let id = Math.floor(Math.random() * 1000).toString(); 

        while (this._socialMedia.profiles.some(profile => profile.id === id)) {
            id = Math.floor(Math.random() * 1000).toString();
        }

        return id;
    }

    public saveData(): void {
        DataSaver.saveProfiles(this._socialMedia.profiles);
        DataSaver.savePosts(this._socialMedia.posts);
    }

    public loadData(): void {
        // Se já existem perfis ou posts carregados, não carregue novamente
        if (this._socialMedia.profiles.length > 0 || this._socialMedia.posts.length > 0) {
            throw new AlreadyExistsError("Dados já carregados.");
        }
    
        // Carregar perfis
        const profilesData: any[] = DataReader.readProfiles();
        const profilesMap: Map<string, Profile> = new Map();
    
        profilesData.forEach(profileData => {
            const newProfile = new Profile(
                profileData._id,
                profileData._name,
                profileData._photo,
                profileData._email,
                profileData._password,
                profileData._status,
                [],
                []
            );
            profilesMap.set(newProfile.id, newProfile);
            this._socialMedia.addProfile(newProfile); // Adicionar cada perfil individualmente
        });
    
        // Associar amigos aos perfis
        profilesData.forEach(profileData => {
            const profile = profilesMap.get(profileData._id);
            if (profile && profileData._friends) {
                profile.friends = profileData._friends
                    .map((friendId: string) => profilesMap.get(friendId))
                    .filter((friend: Profile | undefined) => friend !== undefined) as Profile[];
            }
        });
    
        // Carregar posts
        const postsData: any[] = DataReader.readPosts();
        postsData.forEach(postData => {
            // Encontra o perfil que fez o post
            const profile = profilesMap.get(postData._profileId);
            if (!profile) {
                console.warn(`Perfil não encontrado para o post com ID ${postData._id}`);
                return; // Ignorar posts sem perfil válido
            }
            const newPost = new Post(postData._id, postData._content, postData._date, profile);
            this._socialMedia.addPost(newPost); // Adicionar cada post individualmente
        });
    
        console.log("Dados carregados com sucesso!");
    }
}

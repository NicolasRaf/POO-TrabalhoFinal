import { Categories, OptionsPhoto } from "../enum";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "../errs";
import { Menu, ActionDispatcher } from "../interface";
import { SocialMedia, Profile, Post } from "../models";
import { input, DataReader, DataSaver, pressEnter, promptInput, inputEmail} from "../utils";


export class App {
    private _socialMedia: SocialMedia;
    private _currentUser : Profile | undefined;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._currentUser = undefined;
        this._registerActions(); 
        this._menu = new Menu(Categories.Aut);

        this.loadData();
        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        const actions = [
            { name: "Buscar perfil", action: () => this._socialMedia.searchProfile(promptInput("Informe alguns dos dados(email/name/id): ", "Usuário não encontrado")) },
            { name: "Listar perfis", action: () => this._socialMedia.listProfiles() },
            { name: "Adicionar publicação", action: () => this._socialMedia.addPost(Post.createPost(this._currentUser))},
            { name: "Listar publicações", action: () => this._socialMedia.listPosts() },
            { name: "Enviar solicitação de amizade", action: () => this._socialMedia.sendFriendRequest(this._currentUser, searchProfile(promptInput("Informe alguns dos dados(email/name/id): ", "Usuário não encontrado"))), },
            { name: "Aceitar solicitação de amizade", action: () => this.acceptFriendRequest() },
            { name: "Recusar solicitação de amizade", action: () => this.rejectFriendRequest() },
            { name: "Interagir com publicação", action: () => this.addInteraction() },
            { name: "Carregar dados", action: () => this.loadData() }
        ];
        
        actions.forEach(({ name, action }) => {
            ActionDispatcher.registerAction(name, Categories.Princ, action);
            ActionDispatcher.registerAction(name, Categories.PrincAdm, action);
        });
        
        ActionDispatcher.registerAction("Gerenciar permissões de usuários", Categories.PrincAdm, () => ());
        ActionDispatcher.registerAction("Cadastro", Categories.Aut, () => this.register());
        ActionDispatcher.registerAction("Login", Categories.Aut, () => this.login());
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
        const username = promptInput("Nome de usuário: ", "O nome de usuário não pode estar vazio.");
        console.log(`DEBUG: username recebido -> "${username}"`);

        const email = inputEmail();
        const password = promptInput("Senha: ", "A se nha não pode estar vazia.");
    
        const status: boolean = true;
        const friends: Profile[] = [];
        const posts: Post[] = [];
    
        try {
            if (this.isEmailRegistered(email)) {
                throw new ApplicationError("Email já cadastrado.");
            }
    
            const id = this.gernerateId();
            const photo = this.chooseProfilePhoto();
    
            const user = new Profile(id, username, photo, email, password, status, friends, posts);
            this._socialMedia.addProfile(user);
    
            console.log("Usuário registrado com sucesso!");
            pressEnter();
            this._menu.selectCategory(Categories.Princ);
        } catch (error) {
            console.error("Erro ao registrar usuário: " + (error as ApplicationError).message);
        }
    }
    

    private isEmailRegistered(email: string): boolean {
        try {
            this._socialMedia.searchProfile(email)[0];
            return true;
        } catch (error) {
            if (error instanceof NotFoundError) {
                return false;
            } else {
                throw error;
            }
        }
    }
    
    private chooseProfilePhoto(): string {
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
        return photo;
    }
    
    public gernerateId(): string {
        let id = Math.floor(Math.random() * 1000).toString(); 

        while (this._socialMedia.profiles.some(profile => profile.id === id)) {
            id = Math.floor(Math.random() * 1000).toString();
        }

        return id;
    }

    public saveData(): void {
        console.warn("Salvando dados...");
        DataSaver.saveData(this._socialMedia.profiles);
        DataSaver.saveData(this._socialMedia.posts);
    }

    public loadData(): void {
        // Se já existem perfis ou posts carregados, não carregue novamente
        if (this._socialMedia.profiles.length > 0 || this._socialMedia.posts.length > 0) {
            throw new AlreadyExistsError("Dados já carregados.");
        }
    
        // Carregar perfis
        const profilesData: any[] = DataReader.readData("profiles");
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
        const postsData: any[] = DataReader.readData("posts").reverse();
        const posts: Post[] = postsData.map((post) => {
            const profile = post._profile && post._profile._id ? 
            this._socialMedia.searchProfile(post._profile._id)[0] : undefined;
            return new Post(
                post._id,
                post._content,
                post._date,
                profile
            );
        });
        this._socialMedia.posts = posts;
    }
}

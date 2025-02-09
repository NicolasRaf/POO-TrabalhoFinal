import { Categories, OptionsPhoto } from "./enum";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile, Post } from "./models";
import { input, DataReader, DataSaver, pressEnter, promptInput, inputEmail} from "./utils";


export class App {
    private _socialMedia: SocialMedia;
    private _currentUser?: Profile;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._registerActions(); 
        this._menu = new Menu(Categories.Princ);

		this.loadData();
        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        const actions = [
            { name: "Listar todos os perfis", category: Categories.Princ, action: () => this._socialMedia.listProfiles() },
            { name: "Listar perfis com nome 'José'", category: Categories.Princ, action: () => this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) },
            { name: "Listar todos os posts", category: Categories.Princ, action: () => this._socialMedia.listPosts() },
            { name: "Listar amigos", category: Categories.Princ, action: () => console.log(this._socialMedia.searchProfile("5")[0].friends)},
            { name: "Cadastro", category: Categories.Aut, action: () => this.register() },
            { name: "Login", category: Categories.Aut, action: () => this.login() },
            { name: "Carregar dados", category: Categories.Princ, action: () => this.loadData() },
            { name: "Salvar dados", category: Categories.Princ, action: () => this.saveData() },
        ];

        actions.forEach(({ name, category, action }) => {
            ActionDispatcher.registerAction(name, category, action);
        });
    }

    public run(): void {
        this._menu.start();
    }

    public login(): void {
        const email = inputEmail();
        const password = promptInput("Senha: ", "A senha não pode estar vazia.");
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
		const email = inputEmail();
		const password = promptInput("Senha: ", "A senha não pode estar vazia.");
	
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
        const profiles = this._socialMedia.profiles.map(profile => ({
            _id: profile.id,
            _name: profile.name,
            _photo: profile.photo,
            _email: profile.email,
            _password: profile.password,
            _status: profile.status,
            friends: profile.friends.map(friend => ({
                _id: friend.id,
                _name: friend.name,
                _photo: friend.photo,
                _email: friend.email,
                _password: friend.password,
                _status: friend.status
            })), // Salva os detalhes dos amigos
            _posts: profile.posts.map(post => post.id) // Salva apenas os IDs dos posts
        }));
    
        const posts = this._socialMedia.posts.map(post => ({
            _id: post.id,
            _content: post.content,
            _date: post.date,
            _profile: post.profile?.id // Salva apenas o ID do perfil
        }));
    
        DataSaver.saveProfiles(profiles);
        DataSaver.savePosts(posts);
    }
    
    public loadData(): void {
        if (this._socialMedia.profiles.length > 0 || this._socialMedia.posts.length > 0) {
            throw new AlreadyExistsError("Dados já carregados.");
        }

        const profilesData: any[] = DataReader.readData("profiles");
        const profilesMap: Map<string, Profile> = new Map();
    
        // Cria perfis sem amigos
        const profiles: Profile[] = profilesData.map((profile) => {
            const newProfile = new Profile(
                profile._id,
                profile._name,
                profile._photo,
                profile._email,
                profile._password,
                profile._status,
                [],
                []
            );
            profilesMap.set(newProfile.id, newProfile);
            return newProfile;
        });
    
        // Associa os amigos aos perfis
        profilesData.forEach((profileData) => {
            const profile = profilesMap.get(profileData._id);
            if (profile && profileData.friends) {
                profile.friends = profileData.friends.map((friendData: any) => profilesMap.get(friendData._id)).filter((friend: Profile) => friend !== undefined);
            }
        });
    
        this._socialMedia.profiles = profiles;
    
        const postsData: any[] = DataReader.readData("posts");
        const posts: Post[] = postsData.map((post) => {
            const profileId = post._profile;
            const profile = profilesMap.get(profileId);
    
            if (!profile) {
                console.warn(`Perfil não encontrado para o post com ID ${post._id}`);
                return null;
            }
    
            const newPost = new Post(
                post._id,
                post._content,
                post._date,
                profile
            );
    
            profile.posts.push(newPost); // Adiciona o post à lista de posts do perfil
    
            return newPost;
        }).filter(post => post !== null) as Post[];
    
        this._socialMedia.posts = posts;
    
        console.log("Dados carregados com sucesso!");
    }    
    
}

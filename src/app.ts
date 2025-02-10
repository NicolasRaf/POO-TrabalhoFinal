import { Categories, OptionsPhoto } from "./enum";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile, Post } from "./models";
import { input, DataReader, DataSaver, pressEnter, promptInput, inputEmail} from "./utils";


export class App {
    private _socialMedia: SocialMedia;
    private _currentUser!: Profile;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._registerActions(); 
        this._menu = new Menu(Categories.Aut);

		this.loadData();
        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        ActionDispatcher.registerAction("Cadastro",Categories.Aut, () => this.register());
        ActionDispatcher.registerAction("Login",Categories.Aut, () => this.login());
        ActionDispatcher.registerAction("Carregar dados", "", () => this.loadData());
        ActionDispatcher.registerAction("Salvar dados", "", () => this.saveData());


        const actions = [
            { name: "Perfil", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Photo) },
            { name: "Listar todos os perfis", category: Categories.Princ, action: () => this._socialMedia.listProfiles() },
            { name: "Listar perfis com nome 'José'", category: Categories.Princ, action: () => this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) },
            { name: "Listar todos os posts", category: Categories.Princ, action: () => this._socialMedia.listPosts() },
            { name: "Pesquisar Perfil", category: Categories.Princ, action: () => this._socialMedia.searchProfile(input("Digite o nome do perfil: ")) },

            { name: "Amizades", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Friendly) },
            { name: "Listar Amigos", category: Categories.Friendly, action: () => this._socialMedia.listProfiles(this._currentUser.friends) },
            { name: "Listar Solicitações", category: Categories.Friendly, action: () => this._socialMedia.listFriendRequests(this._currentUser)},
            { name: "Enviar Solicitacao", category: Categories.Friendly, action: () => this.sendFriendRequest() },
            { name: "Aceitar Solicitacao", category: Categories.Friendly, action: () => this.acceptFriendRequest() },

            { name: "Postagens", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Post) },
            { name: "Postar", category: Categories.Post, action: () => this._socialMedia.addPost(new Post("1", "Sdas", new Date(), this._currentUser)) },
            { name: "Listar Posts", category: Categories.Post, action: () => this._socialMedia.listPosts(this._currentUser.posts) },
            { name: "Listar Posts de Amigos", category: Categories.Post, action: () => this._socialMedia.listFriendsPosts(this._currentUser.friends) },
            { name: "Deletar Post", category: Categories.Post, action: () => this._socialMedia.deletePost(this._currentUser.posts[0]) },
            { name: "Deletar Conta", category: Categories.Princ, action: () => this._socialMedia.deleteProfile(this._currentUser) },
        ];

        actions.forEach(({ name, category, action }) => {
            ActionDispatcher.registerAction(name, category, action);
        }); 

        console.log("Ações registradas com sucesso!");
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
            pressEnter(); 
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
    
    public sendFriendRequest(): void {
        
        try {
            const name: string = input("Digite o nome da conta que deseja enviar uma solicitacao: ");
            const receivers: Profile[] = this._socialMedia.searchProfile(name);

            receivers.forEach(receiver => {
                console.log(`${receiver.id} - Conta: ${receiver.name}, Email: ${receiver.email}`);
            })
             
            const receiver: Profile = this._socialMedia.searchProfile(input("Digite o id da conta desejada: "))[0];
            this._socialMedia.sendFriendRequest(this._currentUser.id, receiver.id);

        } catch (error) {
            console.error((error as ApplicationError).message);
            pressEnter(); 
            this._menu.selectCategory(Categories.Princ);
            return;
        }
    }

    public acceptFriendRequest(): void {
        try {
            this._socialMedia.listFriendRequests(this._currentUser);
            const sender: Profile = this._socialMedia.searchProfile(input("Digite o id da conta que deseja aceitar a solicitação: "))[0];

            this._socialMedia.acceptFriendRequest(this._currentUser.id, sender.id);
        } catch (error) {
            console.error((error as ApplicationError).message);
            pressEnter(); 
            this._menu.selectCategory(Categories.Princ);
            return;
        }
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
            friends: profile.friends.map(friend => ({ _id: friend.id })),
            _posts: profile.posts.map(post => post.id),
            _requests: profile.friendRequests.map(request => ({ _from: request.sender.id, _to: request.receiver.id }))
        }));

        const posts = this._socialMedia.posts.map(post => ({
            _id: post.id,
            _content: post.content,
            _date: post.date,
            _profile: post.profile?.id
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

        const profiles: Profile[] = profilesData.map(profile => {
            const newProfile = new Profile(
                profile._id, profile._name, profile._photo, profile._email,
                profile._password, profile._status, [], []
            );
            profilesMap.set(newProfile.id, newProfile);
            return newProfile;
        });

        profilesData.forEach(profileData => {
            const profile = profilesMap.get(profileData._id);
            if (profile) {
                // Atribui amigos
                if (profileData.friends) {
                    profile.friends = profileData.friends.map((friend: any) => profilesMap.get(friend._id)).filter(Boolean);
                }
                // Atribui solicitações de amizade
                if (profileData._requests) {
                    profileData._requests.forEach((request: any) => {
                        const sender = profilesMap.get(request._from);
                        const receiver = profilesMap.get(request._to);
                        if (sender && receiver) {
                            const friendRequest = { sender, receiver };
                            profile.friendRequests.push(friendRequest);
                            this._socialMedia._friendRequests.push(friendRequest);
                        }
                    });
                }
            }
        });

        this._socialMedia.profiles = profiles;

        const postsData: any[] = DataReader.readData("posts");
        const posts: Post[] = postsData.map(post => {
            const profile = profilesMap.get(post._profile);
            if (!profile) return null;
            const newPost = new Post(post._id, post._content, post._date, profile);
            profile.posts.push(newPost);
            return newPost;
        }).filter(Boolean) as Post[];

        this._socialMedia.posts = posts;
        console.log("Dados carregados com sucesso!");
    }
}

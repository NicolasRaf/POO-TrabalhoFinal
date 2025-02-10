import { console } from "inspector";
import { Categories, InteractionType, OptionsPhoto } from "./enum";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { AuthenticationError } from "./errs/authetificationError";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile, Post, AdvancedProfile, AdvancedPost, Interaction } from "./models";
import { input, DataReader, DataSaver, pressEnter, promptInput, inputEmail} from "./utils";
import { doubleVerification, inputInteraction } from "./utils/io";


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
        ActionDispatcher.registerAction("Cadastro",Categories.Aut, () => this.register("User"));
        ActionDispatcher.registerAction("Cadastro Admin","", () => this.register("Admin"));
        ActionDispatcher.registerAction("Login",Categories.Aut, () => this.login());
        ActionDispatcher.registerAction("Carregar dados", "", () => this.loadData());
        ActionDispatcher.registerAction("Salvar dados", "", () => this.saveData());

        const actions = [
            { name: "Perfil", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Perfil) },
            { name: "Seu Perfil", category: Categories.Perfil, action: () => this._socialMedia.detailsProfile(this._currentUser) },
            { name: "Listar todos os perfis", category: Categories.Perfil, action: () => this._socialMedia.listProfiles() },
            { name: "Pesquisar Perfil", category: Categories.Perfil, action: () => this.handleSearchProfile() },

            { name: "Amizades", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Friendly) },
            { name: "Listar Amigos", category: Categories.Friendly, action: () => this._socialMedia.listProfiles(this._currentUser.friends) },
            { name: "Listar Solicitações", category: Categories.Friendly, action: () => this._socialMedia.listFriendRequests(this._currentUser)},
            { name: "Enviar Solicitacao", category: Categories.Friendly, action: () => this.sendFriendRequest() },
            { name: "Aceitar Solicitacao", category: Categories.Friendly, action: () => this.acceptFriendRequest() },

            { name: "Postagens", category: Categories.Princ, action: () => this._menu.selectCategory(Categories.Post) },
            { name: "Postar", category: Categories.Post, action: () => this._menu.selectCategory(Categories.TyPost) },
            { name: "Poste Normal", category: Categories.TyPost, action: () => this.createPost("Normal") },
            { name: "Poste Interativo", category: Categories.TyPost, action: () => this.createPost("Adv") },
            { name: "Listar seus Posts", category: Categories.Post, action: () => this._socialMedia.listPosts(this._currentUser.posts) },
            { name: "Listar Posts de Amigos", category: Categories.Post, action: () => this._socialMedia.listFriendsPosts(this._currentUser.friends) },
            { name: "Interagir com Post", category: Categories.Post, action: () => this.interactPost() },
            { name: "Deletar Post", category: Categories.Post, action: () => this.handleDeletePost() },
            { name: "Deletar Conta", category: Categories.Princ, action: () => this.handleDeleteAccount() },
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
            user.status = true;

            if (user instanceof AdvancedProfile) {
                ActionDispatcher.registerAction("Gerenciar Perfil", Categories.Princ, () => this.manageProfiles());
            }
          
            this._menu.selectCategory(Categories.Princ);
        } catch (error) {
            console.error((error as ApplicationError).message);
            pressEnter(); 
            this._menu.selectCategory(Categories.Aut);
        }
    }

    public register(accountType: string): void {
		const username = promptInput("Nome de usuário: ", "O nome de usuário não pode estar vazio.");
		const email = inputEmail();
		const password = promptInput("Senha: ", "A senha não pode estar vazia.");
		const status: boolean = true;
	
		try {
			this.isEmailRegistered(email) 
		
			const id = this.gernerateId();
			const photo = this.chooseProfilePhoto();
	
			const user = (accountType === "User") ?
            new Profile(id, username, photo, email, password, status, [], [] ) :
            new AdvancedProfile(id, username, photo, email, password, status, [], []);
			
            this._socialMedia.addProfile(user);
			console.log("Usuário registrado com sucesso!");

            if (user instanceof AdvancedProfile) {
                ActionDispatcher.registerAction("Gerenciar Perfil", Categories.Princ, () => this.manageProfiles());
            }

            this.redirectPrincipal();
		} catch (error) {
            console.error((error as ApplicationError).message);
            pressEnter(); 
            this._menu.selectCategory(Categories.Aut);
		}
	}
	
	private isEmailRegistered(email: string): void {
        try {
            if (this._socialMedia.searchProfile(email).length > 0) {
                throw new AlreadyExistsError("Email ja cadastrado.");
            }
        } catch (error) {
            if (error instanceof AlreadyExistsError) {
                console.log(error.message);
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

            console.log("Solicitação enviada com sucesso!");
        } catch (error) {
            console.error((error as ApplicationError).message);
            return;
        }
        this.redirectPrincipal();
    }

    public acceptFriendRequest(): void {
        try {
            this._socialMedia.listFriendRequests(this._currentUser);
            const sender: Profile = this._socialMedia.searchProfile(input("Digite o id da conta que deseja aceitar a solicitação: "))[0];

            this._socialMedia.acceptFriendRequest(this._currentUser.id, sender.id);
            console.log("Solicitação aceita com sucesso!");
        } catch (error) {
            console.error((error as ApplicationError).message);
            return;
        }

        this.redirectPrincipal();
    }


    private handleSearchProfile(): void {
        const identifier: string = input("Digite algum identificador do perfil: ");

        try {
            this._socialMedia.listProfiles(this._socialMedia.searchProfile(identifier));
        } catch (error) {
            console.error((error as ApplicationError).message);
        }
        
        this.redirectPrincipal()
    }

    private createPost(type: string): void {
        const content = input("Digite o conteúdo do post: ");
        const post = (type === "Normal") ? 
        new Post(this.gernerateId(), content, new Date(), this._currentUser) : 
        new AdvancedPost(this.gernerateId(), content, new Date(), this._currentUser);

        this._socialMedia.addPost(post);

        console.log("Post criado com sucesso!");
        this.redirectPrincipal();
    }

    private interactPost(): void {
        try {
            const avaliablePosts = this._socialMedia.posts.filter(post => 
                post.type === "Adv" 
                && post.profile != this._currentUser
                && !(post instanceof AdvancedPost && post.interactions.some
                    (interaction => interaction.author === this._currentUser)));    
            
            this._socialMedia.listPosts(avaliablePosts);

            const post: Post = this._socialMedia.searchPost(input("Digite o id do post que deseja interagir: "));
            const interaction: string = inputInteraction();

            this._socialMedia.interactPost(this._currentUser.id, post.id, interaction);
            console.log('Interação realizada com sucesso!');
        } catch (error) {
            console.error((error as ApplicationError).message);
        }
        this.redirectPrincipal();
    }

    private handleDeletePost(): void {
        this._socialMedia.listPosts(this._currentUser.posts)

        const postId = input("Digite o ID do post que deseja deletar: ");
        const post = this._currentUser.posts.find(p => p.id === postId);

        if (post) {
            this._socialMedia.deletePost(post);
            console.warn("Post deletado com sucesso!");
            this.redirectPrincipal();
        } else {
            throw new NotFoundError("Post nao encontrado.");
        }
    }

    private handleDeleteAccount(): void {
        if (!doubleVerification("Voce realmente deseja deletar sua conta?")) {
            throw new ApplicationError("Operação cancelada pelo usuário.");
        }

        this._socialMedia.deleteProfile(this._currentUser);
        console.log("Conta deletada com sucesso!");
        pressEnter();
        this._menu.selectCategory(Categories.Aut);
    }

    private manageProfiles(): void {
        this._socialMedia.listProfiles();

        const profileId = promptInput("\nDigite o ID do perfil que deseja gerenciar: ", "O ID nao pode estar vazio.");
        this._socialMedia.switchProfileStatus(profileId);

        console.log("Perfil gerenciado com sucesso!");
        this.redirectPrincipal()
    }

    private redirectPrincipal(): void {
        pressEnter();
        this._menu.selectCategory(Categories.Princ);
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
            _requests: profile.friendRequests.map(request => ({ _from: request.sender.id, _to: request.receiver.id })),
            _type: (profile instanceof AdvancedProfile) ? "Admin" : "User"
        }));
    
        const posts = this._socialMedia.posts.map(post => {
            const basePost = {
                _id: post.id,
                _content: post.content,
                _date: post.date,
                _profile: post.profile?.id,
                _type: post.type
            };
            if (post instanceof AdvancedPost) {
                return {
                    ...basePost,
                    _interaction: post.interactions.map(interaction => ({
                        _type: interaction.type,
                        _author: interaction.author?.id
                    }))
                };
            }
            return basePost;
        });
    
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
            const newProfile = (profile._type === "User") ? 
                new Profile(
                    profile._id, profile._name, profile._photo, profile._email,
                    profile._password, profile._status, [], [], []) :
                new AdvancedProfile(
                    profile._id, profile._name, profile._photo, profile._email,
                    profile._password, profile._status, [], [], []);
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
            let newPost;
            if (post._type === "Normal") {
                newPost = new Post(post._id, post._content, post._date, profile);
            } else if (post._type === "Adv") {
                const interactions = (post._interaction || []).map((interaction: any) => {
                    const author = profilesMap.get(interaction._author);
                    if (!author) throw new Error("Autor não encontrado");
                    return new Interaction(interaction._type, author);
                });
                newPost = new AdvancedPost(post._id, post._content, new Date(post._date), profile, interactions);
            } else {
                return null;
            }
            if (newPost) profile.posts.push(newPost);
            return newPost;
        }).filter((post): post is Post => post !== null);
    
        this._socialMedia.posts = posts;
    
        console.log("Dados carregados com sucesso!");
    }
}

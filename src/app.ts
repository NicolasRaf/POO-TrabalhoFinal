import { Categories } from "./enum/categories";
import { AlreadyExistsError, ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile, Post } from "./models";
import { input, DataReader, DataSaver, pressEnter } from "./utils";

export class App {
	private _socialMedia: SocialMedia;
	private _currentUser?: Profile;
	private _menu: Menu;

	constructor() {
		this._socialMedia = new SocialMedia();
		this._registerActions();
		this._menu = new Menu(Categories.Princ);

		console.log("Iniciando o app...");
	}

	private _registerActions(): void {
		const actions = [
			{
				name: "Listar todos os perfis",
				category: Categories.Princ,
				action: () => this._socialMedia.listProfiles(),
			},
			{
				name: "Listar todos os posts",
				category: Categories.Princ,
				action: () => this._socialMedia.listPosts(),
			},
			{
				name: "Listar perfis com nome 'José'",
				category: Categories.Princ,
				action: () =>this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")),
			},
			{   name: "Login", 
                category: Categories.Aut, 
                action: () => this.login() 
            },
			{
				name: "Carregar dados",
				category: Categories.Princ,
				action: () => this.loadData(),
			},
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
			if (user.password !== password)
				throw new IncorrctPasswordError("Senha incorreta.");

			this._currentUser = user;
			this._menu.selectCategory(Categories.Princ);
		} catch (error) {
			console.error((error as ApplicationError).message);
			this._menu.selectCategory(Categories.Aut);
		}
	}

	public saveData(): void {
		DataSaver.saveProfiles(this._socialMedia.profiles);
		DataSaver.savePosts(this._socialMedia.posts);
	}

	public loadData(): void {
		if (this._socialMedia.profiles.length > 0 || this._socialMedia.posts.length > 0) {
			throw new AlreadyExistsError("Dados ja carregados.");
		}

		const profilesData: any[] = DataReader.readProfiles();
		const profilesMap: Map<string, Profile> = new Map();
	
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
	
		
		profilesData.forEach((profileData) => {
			const profile = profilesMap.get(profileData._id);
			if (profile && profileData._friends) {
				profile.friends = profileData._friends.map((friend: Profile) => profilesMap.get(friend.id)).filter((friend: Profile) => friend !== undefined);
			}
		});
	
		this._socialMedia.profiles = profiles;
	
		const postsData: any[] = DataReader.readPosts();
		const posts: Post[] = postsData.map((post) => {
			const profile = post._profile && post._profile._id ? this._socialMedia.searchProfile(post._profile._id)[0] : undefined;
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

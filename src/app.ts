import { Categories } from "./enum/categories";
import { ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { Menu, ActionDispatcher } from "./interface";
import { SocialMedia, Profile } from "./models";
import { input, DataReader, DataSaver, pressEnter } from "./utils";

export class App {
    private _socialMedia: SocialMedia;
    private _currentUser?: Profile;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._registerActions(); 
        this._menu = new Menu(Categories.Aut);;

        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        const actions = [
            { name: "Listar todos os perfis", category: Categories.Princ, action: () => this._socialMedia.listProfiles() },
            { name: "Listar perfis com nome 'José'", category: Categories.Princ, action: () => this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) },
            { name: "Login", category: Categories.Aut, action: () => this.login() }
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
 
    public saveData(): void {
        DataSaver.saveProfiles(this._socialMedia.profiles);
        DataSaver.savePosts(this._socialMedia.posts);
    }
}   
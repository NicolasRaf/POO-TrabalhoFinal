import { ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { ActionDispatcher } from "./interface/actions_dispatcher";
import { Menu } from "./interface/menu";
import { SocialMedia, Profile } from "./models";
import { input } from "./utils/io";

export class App {
    private _socialMedia: SocialMedia;
    private _currentUser?: Profile;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._registerActions(); 
        this._menu = new Menu("Autenticação");

        console.log("Iniciando o app...");
    }

    private _registerActions(): void {
        const actions = [
            { name: "Listar todos os perfis", category: "Principal", action: () => this._socialMedia.listProfiles() },
            { name: "Listar perfis com nome 'José'", category: "Principal", action: () => this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) },
            { name: "Login", category: "Autenticação", action: () => this.login() }
        ];

        actions.forEach(({ name, category, action }) => {
            ActionDispatcher.registerAction(name, category, action);
        });
    }

    public run(): void {
        this._menu.start();
    }

    public login(): void {
        console.log("Executando login...");
    }
}

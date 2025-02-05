import { ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { ItemMenu } from "./interface/item_menu";
import { Menu } from "./interface/menu";
import { SocialMedia, Profile } from "./models";
import { input } from "./utils/io";

export class App {
    private _socialMedia: SocialMedia;
    private _currentUser?: Profile ;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._menu = new Menu(this._initMenu());
        this._initMenu();

        console.log("Iniciando o app...")
    }
    private _initMenu(): ItemMenu[] {
        return [ 
        new ItemMenu("Listar todos os perfis", () => { this._socialMedia.listProfiles() } ),
        new ItemMenu("Listar todos os perfis com o nome 'José'", () => { this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) } ),
      ];
    }

    public run(): void {
        this._menu.start();
    }

    public login(): void {
    }

}
import { ApplicationError, IncorrctPasswordError, NotFoundError } from "./errs";
import { ItemMenu } from "./interface/item_menu";
import { Menu } from "./interface/menu";
import { SocialMedia, Profile } from "./models";
import { input } from "./utils/io";

export class App {
    private _socialMedia: SocialMedia;
    private _currentUser!: Profile ;
    private _menu: Menu;

    constructor() {
        this._socialMedia = new SocialMedia();
        this._menu = new Menu();
        this._initMenu();

        console.log("Iniciando o app...")
    }

    /**
     * Initializes the menu with predefined items. 
     * This includes options to list all profiles and 
     * specifically list profiles with the name 'José'.
     */
    private _initMenu(): void {
        this._menu.fillMenu(
        [ new ItemMenu("Listar todos os perfis", () => { this._socialMedia.listProfiles() } ),
          new ItemMenu("Listar todos os perfis com o nome 'José'", () => 
        { this._socialMedia.listProfiles(this._socialMedia.searchProfile("José")) } ),
        ]
      )
    }

    public run(): void {
        this._menu.start();
    }


    public login(): void {
        console.log("Login...");
        const email: string = input("Email: ");
        const password: string = input("Password: ");

        try {
            const profiles: Profile[] = this._socialMedia.searchProfile(email);
            if (profiles.length === 0) {
                throw new NotFoundError("Perfil nao encontrado.");
            }
            const profile: Profile = profiles[0];
            if (profile.password !== password) {
                throw new IncorrctPasswordError("Senha incorreta.");
            }

            console.log("Login realizado com sucesso.");
        } catch (error) {
            if (error instanceof ApplicationError) {
                console.log(error.message);
            }
        }

        this._currentUser = this._socialMedia.searchProfile(email)[0];
    }

}
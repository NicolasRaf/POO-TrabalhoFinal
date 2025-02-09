import readline from "readline";
import { ActionDispatcher } from "./actions_dispatcher";
import { ApplicationError } from "../errs";

export class Menu {
    private _items: string[] = [];
    private _selectedIndex = 0;
    private _running = false;
    private _currentCategory: string;

    constructor(category: string) {
        this._currentCategory = category;
        this._items = ActionDispatcher.listActions(category);
    }

    public selectCategory(category: string): void {
        this._currentCategory = category;
        this._items = ActionDispatcher.listActions(category);
        this.start();
    }

    private showItems(): void {
        console.clear();
        console.log(`===== ${this._currentCategory} =====`);
        this._items.forEach((item, index) => {
            const prefix = this._selectedIndex === index ? "> " : "  ";
            console.log(`${prefix}${item}`);
        });
        console.log("============================");
        console.log("Pressione ESC para sair.");
    }

    public start(): void {
        if (this._running) return; 
        this._running = true;

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();

        this.showItems();
        this.listenKeys();
    }
    
    private listenKeys(): void {
        process.stdin.on("keypress", (_, key) => {
            if (!this._running) return;

            if (key.name === "up") {
                this._selectedIndex = (this._selectedIndex - 1 + this._items.length) % this._items.length;
            } else if (key.name === "down") {
                this._selectedIndex = (this._selectedIndex + 1) % this._items.length;
            } else if (key.name === "return") {
                console.clear();
                this._running = false;
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners("keypress");

                const actionName = this._items[this._selectedIndex];
            
                ActionDispatcher.executeAction(actionName); 

                console.log("Pressione Enter para voltar ao menu.");
                process.stdin.once("data", () => this.start());

                return;
            } else if (key.name === "escape") {
                console.clear();
                console.log("Saindo do menu...");
                this._running = false;
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners("keypress");
                process.exit();
            }

            this.showItems();
        });
    }
}

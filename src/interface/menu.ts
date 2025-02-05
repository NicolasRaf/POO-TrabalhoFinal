import readline from "readline";
import { ApplicationError } from "../errs";
import { ItemMenu } from "./item_menu";
import { pressEnter } from "../utils/io";

export class Menu {
    private _items: ItemMenu[] = [];
    private _selectedIndex = 0;
    private _running = false;


    constructor(items: ItemMenu[]) {
        this._items = items;
    }

    private showItems(): void {
        console.clear();
        console.log("=".repeat(20) + " Menu " + "=".repeat(20));
        this._items.forEach((item, index) => {
            const prefix = this._selectedIndex === index ? "> " : "  ";
            console.log(`${prefix}${item.name}`);
        });
        console.log("=".repeat(46));
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

                try {
                    this._items[this._selectedIndex].callback();
                } catch (error) {
                    if (error instanceof ApplicationError) {
                        console.log(error.message);
                    } else {
                        console.log("Ocorreu um erro inesperado.");
                    }
                }

                pressEnter();
                this.start();

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
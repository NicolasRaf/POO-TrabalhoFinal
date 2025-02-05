import readline from "readline";
import { ApplicationError } from "../errs";
import { ItemMenu } from "./item_menu";
import { pressEnter } from "../utils/io";

export class Menu {
    private items: ItemMenu[] = [];
    private selectedIndex = 0;
    private running = false;

    public fillMenu(itens: ItemMenu[]): void {
        this.items = itens;
    }

    private showItems(): void {
        console.clear();
        console.log("=".repeat(20) + " Menu " + "=".repeat(20));
        this.items.forEach((item, index) => {
            const prefix = this.selectedIndex === index ? "> " : "  ";
            console.log(`${prefix}${item.name}`);
        });
        console.log("=".repeat(46));
        console.log("Pressione ESC para sair.");
    }

    public start(): void {
        if (this.running) return; // Evita múltiplas execuções
        this.running = true;

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();

        this.showItems();
        this.listenKeys();
    }

    private listenKeys(): void {
        process.stdin.on("keypress", (_, key) => {
            if (!this.running) return;

            if (key.name === "up") {
                this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
            } else if (key.name === "down") {
                this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
            } else if (key.name === "return") {
                console.clear();
                this.running = false;
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners("keypress");

                try {
                    this.items[this.selectedIndex].callback();
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
                this.running = false;
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners("keypress");
                process.exit();
            }

            this.showItems();
        });
    }
}

import { input } from "../utils/io";
import { ItemMenu } from "./item_menu";

export class Menu {
    private items: ItemMenu[] = [];

    // Adiciona um novo item ao menu
    public addItem(name: string, func: () => void): void {
        this.items.push(new ItemMenu(name, func));
    }

    // Exibe os itens do menu
    public showItems(): void {
        console.log("Menu de Opções:");
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name}`);
        });
    }

    // Executa a função correspondente ao item selecionado
    public selectItem(index: number): void {
        if (index < 0 || index >= this.items.length) {
            console.log("Opção inválida. Tente novamente.");
            return;
        }
        this.items[index].callback(); // Chama a função associada ao item
    }

    // Método para iniciar o menu e interagir com o usuário
    public start(): void {
        this.addItem("Dizer Oi", () => console.log("Oi!"));
        this.addItem("Dizer Tchau", () => console.log("Tchau!"));
        
        this.showItems();

        const userChoice: string = input("Escolha uma opção:"); 
        const choiceIndex = parseInt(userChoice) - 1; 

        this.selectItem(choiceIndex);
    }
}

// import { Menu } from "./menu";
// import { ItemMenu } from "./item_menu";

// export class EnterMenu extends Menu {
//     public isLoggedIn: boolean;

//     constructor() {
//         super([
//             new ItemMenu("Login", () => this.login()),
//             new ItemMenu("Cadastro", () => this.register()),
//             new ItemMenu("Sair", () => process.exit())
//         ]);
//         this.isLoggedIn = false;
//     }

//     public async start(): Promise<void> {
//         // Apenas inicia a navegação do menu
//         console.clear();
//         console.log("Bem-vindo! Escolha uma opção:");
//         super.start();
//     }

//     private login(): void {
//         console.log("Digite seu email e senha para logar...");
//         // Aqui você pode pedir os dados do usuário e autenticar
//         this.isLoggedIn = true; // Simulando login bem-sucedido
//         console.log("Login realizado com sucesso!");
//     }

//     private register(): void {
//         console.log("Registro de novo usuário...");
//         // Implementar lógica de cadastro aqui
//     }
// }

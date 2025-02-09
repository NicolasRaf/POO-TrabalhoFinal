import { Profile } from "./profile";
import { input } from "../utils"; // Assumindo que input seja uma função de utilidade para obter entradas do usuário

export class Post { 
    private _id: string;
    private _content: string;
    private _date: Date;
    private _profile?: Profile;
    private static _idList: Set<string> = new Set(); // Usamos Set para garantir IDs únicos

    // Construtor unificado
    constructor(content: string, date: Date, profile?: Profile, id?: string) {
        this._id = id || this.generateId(); // Se não for fornecido, gera ID único
        this._content = content;    
        this._date = date;
        this._profile = profile;
    }

    get content(): string { 
        return this._content; 
    }

    get id(): string {
        return this._id;
    }

    get date(): Date {
        return this._date;
    }

    get profile(): Profile | undefined {
        return this._profile;
    }

    // Exibe informações sobre o post
    public showPost() { 
        console.log(`Conteúdo: ${this._content}`);
        console.log(`Data: ${this._date.toLocaleString().split("T")[0]}`);   
        console.log(`Perfil: ${this._profile?.name}`);
    }

    // Gera um ID único para o post
    private generateId(): string {
        let id = Math.floor(Math.random() * 1000).toString();

        // Garante que o ID não seja duplicado
        while (Post._idList.has(id)) {
            id = Math.floor(Math.random() * 1000).toString();
        }

        Post._idList.add(id); // Adiciona o ID gerado ao conjunto de IDs
        return id;
    }

    // Função estática para criar um post
    public static createPost(profile: Profile): Post {
        const content = input("Digite o conteúdo do post: ");
        const date = new Date();
        const post = new Post(content, date, profile); // Cria o post com os dados fornecidos
        return post; // Retorna o post criado
    }
}

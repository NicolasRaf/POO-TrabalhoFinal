import { Profile } from "./profile";
export class Post { 
    private _id: string;
    private _content: string;
    private _date: Date;
    private _profile?: Profile;

    constructor(id: string, content: string, date: Date, profile?: Profile) {
        this._id = id;
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

    public showPost() { 
        console.log(`Contéudo: ${this._content}`);
        console.log(`Data: ${this._date.toLocaleString().split("T")[0]}`);   
        console.log(`Perfil: ${this._profile?.name}`);
    }
}
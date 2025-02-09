import { Profile } from "./profile";
export class Post { 
    private _id: string;
    private _content: string;
    private _date: Date;
    private _profile: Profile;

    constructor(id: string, content: string, date: Date, profile: Profile) {
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

    get profile(): Profile {
        return this._profile;
    }

    public showContent() { 
        console.log(this._content); 
    }
}
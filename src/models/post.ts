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
}
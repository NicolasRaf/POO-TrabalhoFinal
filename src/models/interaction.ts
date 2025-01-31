import { Profile } from "./profile";
enum InteractionType {
    "curtir" = "👍",
    "não curtir" = "👎",
    "riso" = "🤣",
    "surpresa" = "😯"
}

export class Interaction {
    private _id: number;
    private _type: InteractionType;
    private _author: Profile

    constructor(id: number, type: InteractionType, author: Profile) {
        this._id = id;
        this._type = type;
        this._author = author;
    }
}
import { Profile } from "./profile";
import { InteractionType } from "../enum/interactions";

export class Interaction {
    private _id?: string;
    private _type: InteractionType;
    private _author?: Profile

    constructor(type: InteractionType, author?: Profile) {
        this._type = type;
        this._author = author;
    }

    get type(): InteractionType {
        return this._type;
    }

    get author(): Profile | undefined {
        return this._author;
    }
}
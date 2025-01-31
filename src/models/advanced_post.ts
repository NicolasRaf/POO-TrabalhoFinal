import { Post, Interaction } from "./";

export class AdvancedPost extends Post {
    private _interactions: Interaction[] = [];

    private addInteraction(interaction: Interaction) {
        this._interactions.push(interaction);
    }

    private listInteractions() {
        if (this._interactions.length === 0) {
            throw new Error("Error: No interactions found");
        }

        return this._interactions;
    }
}
import { Console } from "console";
import { NotFoundError } from "../errs";
import { Post, Interaction, Profile } from "./";
import { InteractionType } from "../enum";

export class AdvancedPost extends Post {
    private _interactions: Interaction[];
    public type: string = "Adv";

    constructor(id: string, content: string, date: Date, profile?: Profile, interactions: Interaction[] = []) {
        super(id, content, date, profile);
        this._interactions = interactions;
    }
    public addInteraction(interaction: Interaction) {
        this._interactions.push(interaction);
    }

    get interactions(): Interaction[] {
        return this._interactions;
    }

    public showPost() {
        const counts: Record<InteractionType, number> = {
            [InteractionType["curtir"]]: 0,
            [InteractionType["não curtir"]]: 0,
            [InteractionType["riso"]]: 0,
            [InteractionType["surpresa"]]: 0,
        };
    
        this.interactions.forEach((interaction) => {
            if (counts.hasOwnProperty(interaction.type)) {
                counts[interaction.type]++;
            }
        });
    
        console.log(`Conteúdo: ${this.content}`);
        console.log(`Data: ${this.date.toLocaleString().split("T")[0]}`);
        console.log(`Perfil: ${this.profile?.name}`);
        console.log("=".repeat(30));
        console.log("Interações:");
        Object.entries(counts).forEach(([emoji, count]) => {
            console.log(`${emoji}: ${count}`);
        });
    }
}
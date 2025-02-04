import { AlreadyExistsError, NotFoundError } from "../errs";
import { Post } from "./post";
import { Profile } from "./profile";

export class SocialMedia {
    private _profiles: Profile[];
    private _posts: Post[];
    private _friendRequests: Map<Profile, Profile>;

    constructor() {
        this._profiles = [];
        this._posts = [];
        this._friendRequests = new Map();
    }

    get profiles(): Profile[] {
        return this._profiles;
    }

    public addProfile(profile: Profile) {
        if (this._profiles.includes(profile)) {
            throw new AlreadyExistsError("Perfil ja cadastrado.");
        }
        this._profiles.push(profile);
    }

    public searchProfile(identifier: string): Profile[] {
        let profiles: Profile[] = [];
        const profileType = identifier.includes("@") ? "email" : isNaN(Number(identifier)) ? "name" : "id";
        
        const profileSearchMap: Record<string, (id: string) => Profile[]> = {
            "email": (id: string) => this._profiles.filter(profile => profile.email === id),
            "name": (id: string) => this._profiles.filter(profile => profile.name === id),
            "id": (id: string) => this._profiles.filter(profile => profile.id === id)
        };
        profiles = profileSearchMap[profileType](identifier);
    
        if (profiles.length === 0) {
            throw new NotFoundError("Perfil não encontrado.");
        }
          
        return profiles;
    }
    
    
    public listProfiles(profiles: Profile[] = this._profiles): Profile[] {
        if (this._profiles.length === 0) {
            throw new NotFoundError("Nenhum perfil cadastrado.");
        }
        
        for (let profile of profiles) {
            console.log(`\nPerfil de ID ${profile.id}`);

            console.log("=".repeat(30));
            profile.showProfile();
            console.log("=".repeat(30));
        };  

        return this._profiles;
    }


}

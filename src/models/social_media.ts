import { InteractionType } from "../enum/interactions";
import { AlreadyExistsError, NotFoundError } from "../errs";
import { AdvancedPost } from "./advanced_post";
import { Interaction } from "./interaction";
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

    public searchPost(id: string): Post {
        const post: Post | undefined = this._posts.find(post => post.id === id);
        
        if (!post) {
            throw new NotFoundError("Post nao encontrado.");
        }

        return post;
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

    public switchProfileStatus(identifier: string): void {
        const profile: Profile = this.searchProfile(identifier)[0];
        profile.status = !profile.status;
    }

    public sendFriendRequest(profileIndetifier: string, friendIdentifier: string): void {
        const profile: Profile = this.searchProfile(profileIndetifier)[0];
        const friend: Profile = this.searchProfile(friendIdentifier)[0];

        this._friendRequests.set(profile, friend);
    }

    public acceptFriendRequest(profileIdentifier: string, friendIdentifier: string): void {
        const profile: Profile = this.searchProfile(profileIdentifier)[0];  
        const friend: Profile = this.searchProfile(friendIdentifier)[0];    
    
        if (this._friendRequests.get(profile) === friend) {
            profile.addFriend(friend);
            friend.addFriend(profile);
            
            this._friendRequests.delete(profile);
        } else {
            throw new NotFoundError("Solicitação nao encontrada.");	
        }
    }

    public declineFriendRequest(profileIdentifier: string, friendIdentifier: string): void {
        const profile: Profile = this.searchProfile(profileIdentifier)[0];
        const friend: Profile = this.searchProfile(friendIdentifier)[0];    
    
        this._friendRequests.forEach((sender, receiver) => {
            if (receiver === profile && sender === friend) {
                this._friendRequests.delete(receiver);
            }
        });
    }

    public interactPost(profileIdentifier: string, postIdentifier: string): void {
        const profile: Profile = this.searchProfile(profileIdentifier)[0];  
        const post: Post = this._posts.filter(post => post.id === postIdentifier)[0];    
        
        if (profile.status && post instanceof AdvancedPost) {
            post.addInteraction(new Interaction( InteractionType.curtir, profile));
        }
    }
}

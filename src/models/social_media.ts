import { InteractionType } from "../enum/interactions";
import { AlreadyExistsError, ApplicationError, NotFoundError } from "../errs";
import { pressEnter } from "../utils";
import { Interaction, Profile, AdvancedProfile, Post, AdvancedPost } from "./"

export class SocialMedia {
    public profiles: Profile[];
    public posts: Post[];
    public _friendRequests: Array<{ sender: Profile, receiver: Profile }>;

    constructor() {
        this.profiles = [];
        this.posts = [];
        this._friendRequests = [];
    }
   
    public addProfile(profile: Profile) {
        if (this.profiles.includes(profile)) {
            throw new AlreadyExistsError("Perfil ja cadastrado.");
        }
        this.profiles.push(profile);
    }

    public deleteProfile(profile: Profile) {
        if (!this.profiles.includes(profile)) {
            throw new NotFoundError("Perfil nao encontrado.");
        }
        this.profiles = this.profiles.filter(p => p !== profile);
    }

    public addPost(post: Post) {
        if (this.posts.includes(post)) {
            throw new AlreadyExistsError("Post ja cadastrado.");
        }
        this.posts.push(post);
        post.profile?.addPost(post);
    }

    public deletePost(post: Post) {
        if (!this.posts.includes(post)) {
            throw new NotFoundError("Post nao encontrado.");
        }
        this.posts = this.posts.filter(p => p !== post);
    }

    public searchProfile(identifier: string): Profile[] {
        let profiles: Profile[] = [];
        const profileType = identifier.includes("@") ? "email" : isNaN(Number(identifier)) ? "name" : "id";
        
        const profileSearchMap: Record<string, (id: string) => Profile[]> = {
            "email": (id: string) => this.profiles.filter(profile => profile.email === id),
            "name": (id: string) => this.profiles.filter(profile => profile.name === id),
            "id": (id: string) => this.profiles.filter(profile => profile.id === id)
        };
        profiles = profileSearchMap[profileType](identifier);
    
        if (profiles.length === 0) {
            throw new NotFoundError("Perfil não encontrado.");
        }
          
        return profiles;
    }   

    public searchPost(id: string): Post {
        const post: Post | undefined = this.posts.find(post => post.id === id);
        
        if (!post) {
            throw new NotFoundError("Post nao encontrado.");
        }

        return post;
    }
    
    public detailsProfile(profile: Profile) { 
        console.log(`\nPerfil de ID ${profile.id}`);

        console.log("=".repeat(30));
        profile.showProfile();
        console.log("=".repeat(30));
    }

    public listProfiles(profiles: Profile[] = this.profiles ): Profile[] {
        if (profiles.length === 0) {
            throw new NotFoundError("Nenhum perfil encontrado.");
        }
        
        for (let profile of profiles) {
            this.detailsProfile(profile);
        };  

        return this.profiles;
    }

    public listPosts(posts: Post[] = this.posts): Post[] {
        if (posts.length === 0) {
            throw new NotFoundError("Nenhum post cadastrado.");
        }

        for (let post of posts) {
            console.log(`\nPost de ID ${post.id}`);

            console.log("=".repeat(30));
            post.showPost();
            console.log("=".repeat(30));
        };  

        return posts;
    }

    public listFriendsPosts(friends: Profile[]): void {
        if (friends.length === 0) {
            throw new NotFoundError("Nenhum amigo cadastrado.");
        } 
        
        friends.forEach(friend => {
            console.log(`\nPostagens de ${friend.name}`);
            console.log("=".repeat(30));
            this.posts.filter(post => post.profile === friend).forEach(post => post.showPost());
            console.log("=".repeat(30));
        });
    }

    public switchProfileStatus(identifier: string): void {
        const profile: Profile = this.searchProfile(identifier)[0];
        
        profile.status = !profile.status;
    }

    public sendFriendRequest(senderIdentifier: string, receiverIdentifier: string): void {
        const sender: Profile = this.searchProfile(senderIdentifier)[0];
        const receiver: Profile = this.searchProfile(receiverIdentifier)[0];
    
        if (this._friendRequests.some(req => req.sender === sender && req.receiver === receiver)) {
          throw new AlreadyExistsError("Solicitação de amizade já enviada.");
        }
    
        if (sender.friends.includes(receiver)) {
          throw new AlreadyExistsError("Este usuário já é seu amigo.");
        }
    
        receiver.addFriendRequest({ sender, receiver });
        this._friendRequests.push({ sender, receiver });
      }

      public acceptFriendRequest(receiverIdentifier: string, senderIdentifier: string): void {
        const receiver = this.searchProfile(receiverIdentifier)[0];
        const sender = this.searchProfile(senderIdentifier)[0];
    
        const requestIndex = this._friendRequests.findIndex(req => req.sender === sender && req.receiver === receiver);
    
        if (requestIndex === -1) {
          throw new NotFoundError("Solicitação de amizade não encontrada.");
        }
    
        receiver.addFriend(sender);
        sender.addFriend(receiver);
    
        this._friendRequests.splice(requestIndex, 1);
        receiver.friendRequests = receiver.friendRequests.filter(req => req.sender !== sender);
      }

      public removeFriend(profile: Profile, friend: Profile): void {
        if (!profile.friends.includes(friend)) {
          throw new NotFoundError("Este usuário não é seu amigo.");
        }

        profile.removeFriend(friend);
        friend.removeFriend(profile);
      }
    

      public declineFriendRequest(receiverIdentifier: string, senderIdentifier: string): void {
        const receiver = this.searchProfile(receiverIdentifier)[0];
        const sender = this.searchProfile(senderIdentifier)[0];
    
        const requestIndex = this._friendRequests.findIndex(req => req.sender === sender && req.receiver === receiver);
    
        if (requestIndex === -1) {
          throw new NotFoundError("Solicitação de amizade não encontrada.");
        }
    
        this._friendRequests.splice(requestIndex, 1);
        receiver.friendRequests = receiver.friendRequests.filter(req => req.sender !== sender);
      }

    public listFriendRequests(user: Profile): void {
        if (user.friendRequests.length === 0) {
          throw new NotFoundError("Nenhuma solicitação de amizade pendente.");
        }
        console.log(`Solicitações de amizade recebidas:`);
        user.friendRequests.forEach(request => {
          console.log(`- De: ${request.sender.id} - ${request.sender.name} - (${request.sender.email})`);
        });
      }

      public interactPost(profileIdentifier: string, postIdentifier: string, interactionKey: string): void {
        const profile: Profile = this.searchProfile(profileIdentifier)[0];  
        const post: Post = this.searchPost(postIdentifier);    

        if (post.profile === profile){
            throw new ApplicationError("Você não pode interagir com seu próprio post.");
        }

        if (!(post instanceof AdvancedPost)) {
            throw new NotFoundError("Perfil ou post não encontrado.");
        }

        const alreadyInteracted = post.interactions.some(interaction => interaction.author === profile)
        if  (alreadyInteracted){
            throw new ApplicationError("Você ja interagiu com este post.")
        }

        if (post instanceof AdvancedPost) {
            const typeInteraction: InteractionType = InteractionType[interactionKey as keyof typeof InteractionType];
            if (!typeInteraction) {
                throw new ApplicationError("Tipo de interação inválido.");
            }
            
            const interaction: Interaction = new Interaction(typeInteraction, profile);
    
            post.addInteraction(interaction);
        } else {
            throw new NotFoundError("Perfil ou post não encontrado.");
        }
    }
}
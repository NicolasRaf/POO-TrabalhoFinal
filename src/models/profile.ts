import { Post } from "./post";
export class Profile {
    private _id: string;
    private _name: string
    private _photo: string;
    private _email: string;
    private _status: boolean;
    private _friends: Profile[];
    private _posts: Post[];

    constructor(id: string, name: string, photo: string, email: string, status: boolean, friends: Profile[], posts: Post[]) {
        this._id = id;
        this._name = name;  
        this._photo = photo;
        this._email = email;    
        this._status = status;
        this._friends = friends;
        this._posts = posts;
    }

    set status(status: boolean) {
        this._status = status;
    }

    private throwError( condition: boolean, message: string) {
        if (condition) {
            throw new Error(message);
        }
    };
    
    private addFriend(friend: Profile) {
        this.throwError(this._friends.includes(friend), "Friend already exists");

        this._friends.push(friend);
    }

    private removeFriend(friend: Profile) {
        this.throwError(!this._friends.includes(friend), "Friend does not exist");

        this._friends.splice(this._friends.indexOf(friend), 1);
    }   

    private addPost(post: Post) {
        this.throwError(this._posts.includes(post), "Post already exists");

        this._posts.includes(post);

    }
}
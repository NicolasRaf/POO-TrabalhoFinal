import { Post } from "./post";
import { AlreadyExistsError, NotFoundError } from "../errs";


export class Profile {
  private _id: string;
  private _name: string;
  private _photo: string;
  private _email: string;
  private _password: string;
  private _status: boolean;
  private _friends: Profile[];
  private _posts: Post[];

  constructor(id: string, name: string, photo: string, email: string, password: string, status: boolean, friends: Profile[], posts: Post[]) {
    this._id = id;
    this._name = name;
    this._photo = photo;
    this._email = email;
    this._password = password;
    this._status = status;
    this._friends = friends;
    this._posts = posts;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get id() {
    return this._id;
  } 

  get name() {
    return this._name;
  }

  set status(status: boolean) {
    this._status = status;
  }

  public addFriend(friend: Profile) {
    if (this._friends.includes(friend)) {
      throw new AlreadyExistsError("Amigo já adicionado.");
    }
    this._friends.push(friend);
  }

  private removeFriend(friend: Profile) {
    const index = this._friends.indexOf(friend);
    if (index === -1) {
      throw new NotFoundError("Amigo não encontrado.");
    }
    this._friends.splice(index, 1);
  }

  private addPost(post: Post) {
    if (this._posts.includes(post)) {
      throw new AlreadyExistsError("Post já existe.");
    }
    this._posts.push(post);
  }

  public showProfile() {
    console.log(`Nome: ${this._name}`);
    console.log(`Foto: ${this._photo}`);
    console.log(`Email: ${this._email}`);
    console.log(`Status: ${this._status ? "Online" : "Offline"}`);
  }
}

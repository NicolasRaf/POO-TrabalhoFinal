import { ApplicationError } from "../errs";
import { Post, SocialMedia, Profile } from "../models";
import { DataReader, DataSaver } from "../utils";

function main() {
    console.clear();
    const socialMedia = new SocialMedia();
    // Arrays de amigos com nomes diferentes
    let friends1 = [
        new Profile("5", "Miguel", "😎", "email5@gmail.com", "Olá", true, [], []),
        new Profile("6", "Ana", "🌟", "email6@gmail.com", "Olá", true, [], []),
    ];
    socialMedia.addProfile(friends1[0]);
    socialMedia.addProfile(friends1[1]);

    let friends2 = [
        new Profile("7", "Pedro", "🕵️‍♂️", "email7@gmail.com", "Oi", true, [], []),
        new Profile("8", "Laura", "👩‍🚀", "email8@gmail.com", "Oi", true, [], []),
    ];
    socialMedia.addProfile(friends2[0]);
    socialMedia.addProfile(friends2[1]);

    let friends3 = [
        new Profile("9", "Carlos", "🎨", "email9@gmail.com", "Olá", true, [], []),
        new Profile("10", "Mariana", "👩‍🍳", "email10@gmail.com", "Olá", true, [], []),
    ];
    socialMedia.addProfile(friends3[0]);
    socialMedia.addProfile(friends3[1]);


    let friends4 = [
        new Profile("11", "Lucas", "🤹‍♂️", "email11@gmail.com", "Oi", true, [], []),
        new Profile("12", "Fernanda", "👩‍🎤", "email12@gmail.com", "Oi", true, [], []),
    ];
    socialMedia.addProfile(friends4[0]);
    socialMedia.addProfile(friends4[1]);

    let posts1 = [
        new Post("1", "Post 1", new Date(), socialMedia.profiles[0]),
        new Post("2", "Post 2", new Date(), socialMedia.profiles[1]),
        new Post("3", "Post 3", new Date(), socialMedia.profiles[2]),
    ];
    socialMedia.addPost(posts1[0]);
    socialMedia.addPost(posts1[1]);
    socialMedia.addPost(posts1[2]);


    let posts2 = [
        new Post("4", "Post 4", new Date(), socialMedia.profiles[0]),
        new Post("5", "Post 5", new Date(), socialMedia.profiles[1]),
        new Post("6", "Post 6", new Date(), socialMedia.profiles[2]),
    ];
    socialMedia.addPost(posts2[0]);
    socialMedia.addPost(posts2[1]);
    socialMedia.addPost(posts2[2]);


    let posts3 = [
        new Post("7", "Post 7", new Date(), socialMedia.profiles[0]),
        new Post("8", "Post 8", new Date(), socialMedia.profiles[1]),
        new Post("9", "Post 9", new Date(), socialMedia.profiles[2]),
    ];
    socialMedia.addPost(posts3[0]);
    socialMedia.addPost(posts3[1]);
    socialMedia.addPost(posts3[2]);


    let posts4 = [
        new Post("10", "Post 10", new Date(), socialMedia.profiles[0]),
        new Post("11", "Post 11", new Date(), socialMedia.profiles[1]),
        new Post("12", "Post 12", new Date(), socialMedia.profiles[2]),
    ];
    socialMedia.addPost(posts4[0]);
    socialMedia.addPost(posts4[1]);
    socialMedia.addPost(posts4[2]);

    socialMedia.addProfile(new Profile("1", "José", "👺", "email@gmail.com", "pass1", true, friends1, posts1));
    socialMedia.addProfile(new Profile("2", "João", "💩", "email2@gmail.com", "pass2",true, friends2, posts2));
    socialMedia.addProfile(new Profile("3", "Maria", "👽", "email3@gmail.com","pass3", true, friends3, posts3));
    socialMedia.addProfile(new Profile("4", "Aline", "👻", "email4@gmail.com", "pass4",true, friends4, posts4));

    // console.log("Perfis cadastrados:");
    // for (let i of socialMedia.profiles) {
    //     console.log(i);
    // }

    // console.log("Posts cadastrados:");
    // for (let i of socialMedia.posts) {
    //     console.log(i);
    // }

    DataSaver.saveData(socialMedia.profiles);
    DataSaver.saveData(socialMedia.posts);

    // const newSocialMedia = new SocialMedia();

    // DataReader.readProfiles().forEach(profile => {
    //     newSocialMedia.addProfile(profile);
    // });

    // try {
    //     newSocialMedia.listProfiles();
    //     newSocialMedia.listPosts();
    // } catch (error) {
    //     console.error((error as ApplicationError).message);
    // }
}   

main();
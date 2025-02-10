import { SocialMedia } from "../models/social_media";
import { Profile } from "../models/profile";
import { NotFoundError } from "../errs";


function main() {
    const socialMedia = new SocialMedia();
    socialMedia.addProfile(new Profile("1", "José", "👺", "email@gmail.com", "oi", true, [], []));
    socialMedia.addProfile(new Profile("2", "José", "💩", "email2@gmail.com", "oi",true, [], []));
    socialMedia.addProfile(new Profile("3", "Maria", "👽", "email3@gmail.com","oi", true, [], []));
    socialMedia.addProfile(new Profile("4", "Aline", "👻", "email4@gmail.com", "oi",true, [], []));

    // Listagem de perfis com nome "José"
    console.log("\nListagem de todos os perfis com o nome 'José':");
    try {
        socialMedia.listProfiles(socialMedia.searchProfile("José"));
    } catch (error) {
        if (error instanceof NotFoundError)
            console.log(error.message);
    }

    console.log("-".repeat(50));

    // Listagem de todos os perfis
    console.log("\nListagem de todos os perfis:");
    socialMedia.listProfiles();
}

main();
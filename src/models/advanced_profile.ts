import {Profile} from "./profile";

export class AdvancedProfile extends Profile {

    private manageProfiles(profile: Profile) {
        profile.status = !profile.status;
    }
}
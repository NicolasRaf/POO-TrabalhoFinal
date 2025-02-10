import {Profile} from "./profile";

export class AdvancedProfile extends Profile {
    public type: string = "Admin";

    private manageProfiles(profile: Profile) {
        profile.status = !profile.status;
    }
}
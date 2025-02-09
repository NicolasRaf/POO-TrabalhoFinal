import { writeFileSync } from "fs"
import { Post, Profile } from "../models";


export class DataSaver {
    public static saveProfiles(data: Profile[]): void {
        try {
            const dataToSave = JSON.stringify(data, null, 2);
            const filePath = (__filename === "app.ts") ? "../src/data/profiles.json" : "../../src/data/profiles.json";
            writeFileSync(filePath, dataToSave);
    } catch (error) {
            console.error("Error saving data:", error);
        }
    }

    public static savePosts(data: Post[]): void {
        try {
            const dataToSave = JSON.stringify(data, null, 2);
            const filePath = (__filename === "app.ts") ? "../src/data/profiles.json" : "../../src/data/profiles.json";
            writeFileSync(filePath, dataToSave);
    } catch (error) {
            console.error((error as Error).message);
        }
    }
}
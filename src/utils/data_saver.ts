import { writeFileSync } from "fs"
import { Post, Profile } from "../models";
import { join } from "path";


export class DataSaver {
    public static saveData(data: Profile[] | Post[]): void {
        try {
            const dataToSave = JSON.stringify(data, null, 2);
            const fileName: string = data[0] instanceof Profile ? "profiles.json" : "posts.json";
            const filePath: string = join(__dirname, '..', '..', 'src', 'data', fileName);
            writeFileSync(filePath, dataToSave);
    } catch (error) {
            console.error("Error saving data:", error);
        }
    }

}
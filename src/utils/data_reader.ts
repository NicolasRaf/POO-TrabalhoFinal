import { readFileSync } from "fs";
import { Post, Profile } from "../models";

export class DataReader {

    public static readProfiles(): Profile[] {
        const filePath = "../../src/data/profiles.json";
    
        try {
            const data = readFileSync(filePath, "utf-8");
            const profiles: any[] = JSON.parse(data);
            
            return profiles;
        } catch (error) {
            console.error("Error reading data:", error);
            return [];
        }
    }


    
}
import { readFileSync } from "fs";
import { join } from "path";

export class DataReader {

    public static readProfiles(): any[] {
        const filePath: string = join(__dirname, '..', '..', 'src', 'data', 'profiles.json');
        
        try {
            const data = readFileSync(filePath, "utf-8");
            const profiles: any[] = JSON.parse(data);

            return profiles;
        } catch (error) {
            console.error("Error reading data:", error);
            return [];
        }
    }

    public static readPosts(): any[] {
        const filePath = join(__dirname, '..', '..', 'src', 'data', 'posts.json');
        
        try {
            const data = readFileSync(filePath, "utf-8");
            const posts: any[] = JSON.parse(data);
            
            return posts;
        } catch (error) {
            console.error("Error reading data:", error);
            return [];
        }
    }    
}

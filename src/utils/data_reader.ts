import { readFileSync } from "fs";
import { join } from "path";

export class DataReader {

    private static readJsonFile(fileName: string): any[] {
        const filePath = join(__dirname, '..', "..", "src", 'data', fileName);

        try {
            const data = readFileSync(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error(`Erro ao ler o arquivo ${fileName}:`, error);
            return [];
        }
    }

    public static readProfiles(): any[] {
        return this.readJsonFile("profiles.json");
    }

    public static readPosts(): any[] {
        return this.readJsonFile("posts.json");
    }
}

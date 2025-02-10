import { readFileSync } from "fs";
import { join } from "path";

export class DataReader {

    public static readData(fileName: string): any[] {
        const filePath = join(__dirname, '..', "..", "src", 'data', `${fileName}.json`);

        try {
            const data = readFileSync(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error(`Erro ao ler o arquivo ${fileName}:`, error);
            return [];
        }
    }
}

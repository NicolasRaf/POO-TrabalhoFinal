import { writeFileSync } from 'fs';
import { join } from 'path';

export class DataSaver {
    public static saveData(fileName: string, data: any): void {
        const filePath = join(__dirname, '..', "..", "src", 'data', `${fileName}.json`);

        try {
            writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
            console.log(`Dados salvos com sucesso em ${fileName}.json`);
        } catch (error) {
            console.error(`Erro ao salvar os dados em ${fileName}.json:`, error);
        }
    }

    public static saveProfiles(profiles: any[]): void {
        this.saveData('profiles', profiles);
    }

    public static savePosts(posts: any[]): void {
        this.saveData('posts', posts);
    }
}

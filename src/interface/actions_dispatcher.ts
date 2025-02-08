export class ActionDispatcher {
    private static actions = new Map<string, { category: string, action: () => void }>();

    public static registerAction(name: string, category: string, action: () => void): void {
        this.actions.set(name, { category, action });
    }

    public static executeAction(name: string): void {
        if (this.actions.has(name)) {
            this.actions.get(name)!.action(); // Executa a função armazenada
        } else {
            console.log(`Ação "${name}" não encontrada.`);
        }
    }

    public static listActions(category?: string): string[] {
        return Array.from(this.actions.entries())
            .filter(([_, value]) => !category || value.category === category)
            .map(([key]) => key);
    }
}

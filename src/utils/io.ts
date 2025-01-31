import { question } from "readline-sync";

export function input(message: string): string {
    return question(message);
}

export function inputNumber(message: string): number {
    try {
        if (isNaN(Number(input(message)))) {
            throw new Error("Invalid number");
        } 
    } catch (error) {
        console.error("Error:", error);
        return inputNumber(message);
    }

    return Number(input(message));
}


import { question } from "readline-sync";
import { InputError } from "../errs";

export function input(message: string): string {
    return question(message);
}

export function inputNumber(message: string): number {
    try {
        if (isNaN(Number(input(message)))) {
            throw new InputError("Invalid number");
        } 
    } catch (error) {
        console.error("Error:", error);
        return inputNumber(message);
    }

    return Number(input(message));
}

/**
 * Waits for the user to press Enter.
 * Used to pause the application at the end of the menu loop.
 * @returns {void}
 */
export function pressEnter(): void {;
    input("Press Enter to continue...");;   
}

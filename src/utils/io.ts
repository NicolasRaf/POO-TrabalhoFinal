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
export function pressEnter(): void {
    input("Press Enter to continue...");
}

export function promptInput(promptMessage: string, errorMessage: string): string {    
    let inputVal: string;
    do {
        inputVal = input(promptMessage).trim();
        console.log(`DEBUG: username recebido -> "${inputVal}"`); // Adiciona um log para capturar o valor
        if (!inputVal) console.log(errorMessage);
    } while (!inputVal);
    return inputVal;
}

export function inputEmail(): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let email: string;
    do {
        email = input("Email: ");
        if (!emailRegex.test(email)) console.log("Invalid email format. Please enter a valid email address.");
    } while (!emailRegex.test(email));
    return email;
}

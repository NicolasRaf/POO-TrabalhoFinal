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

export function getChar(text: string, validChars?: string[]): string {
    const response = input(text);

    // Check if the input is a single character
    if (response.length !== 1) {
        console.log("Entrada inválida! Por favor, insira apenas um caractere.\n");
        return getChar(text, validChars);
    }

    // Check if the input is valid
    if (validChars != undefined){
        // Check if the character is in the array of valid characters
        if (!validChars.includes(response.toLowerCase()) && !validChars.includes(response.toUpperCase()) ) {
            console.log(`Caractere inválido! Por favor, insira um dos seguintes: ${validChars}\n`);
            return getChar(text, validChars);
        }
    }
    return response;
}

/**
 * Waits for the user to press Enter.
 * Used to pause the application at the end of the menu loop.
 * @returns {void}
 */
export function pressEnter(): void {
    input("\nPressione Enter para voltar ao menu");
}

export function promptInput(promptMessage: string, errorMessage: string): string {    
    let inputVal: string;
    do {
        inputVal = input(promptMessage).trim();
        if (!inputVal) throw new InputError(errorMessage);
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

export function doubleVerification(message: string): boolean {
    const response = getChar(message, ["S", "N"]);
    return response.toLowerCase() === "s";
}

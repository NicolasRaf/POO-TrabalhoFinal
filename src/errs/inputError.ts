import { ApplicationError } from "./applicationError";

export class InputError extends ApplicationError {
    constructor(message: string = "Entrada inválida!") {
        super(message);
    }
}
import { ApplicationError } from "./applicationError";

export class IncorrctPasswordError extends ApplicationError {
    constructor(message: string = "IncorrectPasswordError") {
        super(message);  ;
    }
}
import { ApplicationError } from "./applicationError";

export class InactiveProfileError extends ApplicationError {
    constructor(message: string = "Proibido postar: Perfil Inativo") {
        super(message);  ;
    }
}
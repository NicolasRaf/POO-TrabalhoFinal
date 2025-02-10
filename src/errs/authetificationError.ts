import { ApplicationError } from "./applicationError";

export class AuthenticationError extends ApplicationError {
    constructor(message: string = "Erro na Autenticação") {
        super(message);  ;
    }
}
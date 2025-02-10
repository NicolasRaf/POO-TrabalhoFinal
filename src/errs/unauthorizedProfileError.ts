import { ApplicationError } from "./applicationError";

export class UnauthorizedProfileError extends ApplicationError {
  constructor(message : string = "Perfil não autorizado para mudança de status.") {
    super(message);
  }
}

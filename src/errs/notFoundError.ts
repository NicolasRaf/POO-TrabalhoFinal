import { ApplicationError } from "./applicationError";

export class NotFoundError extends ApplicationError {
  constructor(message = "Recurso não encontrado") {
    super(message);
  }
}

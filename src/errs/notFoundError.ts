import { ApplicationError } from "./applicationError";

export class NotFoundError extends ApplicationError {
  constructor(message : string = "Recurso não encontrado") {
    super(message);
  }
}

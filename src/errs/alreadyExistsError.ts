import { ApplicationError } from "./applicationError";

export class AlreadyExistsError extends ApplicationError {
  constructor(message = "Já existe um registro com este valor") {
    super(message);
  }
}
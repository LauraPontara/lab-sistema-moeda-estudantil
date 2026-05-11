import { ConflictException } from '@nestjs/common';

export class EmailAlreadyInUseException extends ConflictException {
  constructor() {
    super('Este e-mail ja esta cadastrado.');
  }
}

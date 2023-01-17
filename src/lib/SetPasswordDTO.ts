import { ValidationError } from 'class-validator';

export class SetPasswordDTO {
  password!: string;

  passwordConfirmation!: string;

  constructor(_password: string, _passwordConfirmation: string) {
    this.password = _password;
    this.passwordConfirmation = _passwordConfirmation;

    if (this.password !== this.passwordConfirmation) {
      throw new ValidationError();
    }
  }
}

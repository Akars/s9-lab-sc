export class SetPasswordDto {
  password!: string;

  passwordConfirmation!: string;

  constructor(_password: string, _passwordConfirmation: string) {
    this.password = _password;
    this.passwordConfirmation = _passwordConfirmation;
  }
}

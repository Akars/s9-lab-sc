import {
  Entity, PrimaryGeneratedColumn, Column, Unique,
} from 'typeorm';

import { IsNotEmpty, ValidationError } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SetPasswordDTO } from '../lib/SetPasswordDTO';
import { UniqueInColumn } from '../lib/UniqueInColumn';

@Entity()
@Unique(['email'])
export default class User {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    firstname!: string;

  @Column()
    lastname!: string;

  @Column({
    transformer: {
      from(value: string) {
        return value.toLowerCase();
      },
      to(value: string) {
        return value.toLowerCase();
      },
    },
  })
  @UniqueInColumn()
  @IsNotEmpty()
    email!: string;

  @Column()
    passwordHash!: string;

  async setPassword(passwordDTO: SetPasswordDTO) {
    if (passwordDTO.password !== passwordDTO.passwordConfirmation) {
      throw new ValidationError();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordDTO.password, salt);

    this.passwordHash = hash;
  }

  async isPasswordValid(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

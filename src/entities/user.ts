import {
  Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany,
} from 'typeorm';

import { IsNotEmpty, ValidationError } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SetPasswordDto } from '../lib/set-password-dto';
import { UniqueInColumn } from '../lib/unique-in-column';
import { Session } from './session';

@Entity()
@Unique(['email'])
export class User {
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

  @OneToMany(() => Session, (session) => session.user, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
    sessions!: Session[];

  async setPassword(passwordDTO: SetPasswordDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordDTO.password, salt);

    if (passwordDTO.password !== passwordDTO.passwordConfirmation) {
      throw new ValidationError();
    }

    this.passwordHash = hash;
  }

  async isPasswordValid(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

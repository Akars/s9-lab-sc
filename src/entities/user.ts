import {
  Entity, PrimaryGeneratedColumn, Column, Unique,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';

@Entity()
@Unique(['email'])
export default class User {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    firstname!: string;

  @Column()
    lastname!: string;

  @Column()
  @IsNotEmpty()
    email!: string;

  @Column()
    passwordHash!: string;
}

import {
  Entity, PrimaryGeneratedColumn, Column, Unique, BeforeUpdate, BeforeInsert,
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
  @IsNotEmpty()
    email!: string;

  @Column()
    passwordHash!: string;
}

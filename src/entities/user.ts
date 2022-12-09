import {
  Entity, PrimaryGeneratedColumn, Column, Unique,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';
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
}

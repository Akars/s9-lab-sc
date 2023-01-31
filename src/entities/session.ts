import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import * as crypto from 'crypto';
import { User } from './user';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ length: 64, unique: true })
    token!: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
    user!: User;

  @CreateDateColumn()
    createdAt!: Date;

  @Column()
    expiresAt!: Date;

  @Column({ nullable: true })
    revokedAt!: Date;

  @BeforeInsert()
  generateToken() {
    this.token = crypto.randomBytes(48).toString('base64');
    this.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
  }
}

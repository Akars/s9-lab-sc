import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserSubscriber } from './subscribers/UserSubscriber';

const {
  DATABASE_ROLE, DATABASE_HOST, DATABASE_NAME, DATABASE_PWD, DATABASE_PORT,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  username: DATABASE_ROLE,
  host: DATABASE_HOST,
  password: DATABASE_PWD,
  port: parseInt(<string>DATABASE_PORT, 10),
  database: DATABASE_NAME,
  entities: [`${__dirname}/entities/*.{ts,js}`],
  synchronize: true,
  subscribers: [UserSubscriber],
});

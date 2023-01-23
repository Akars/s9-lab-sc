import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  DATABASE_ROLE, DATABASE_HOST, DATABASE_NAME, DATABASE_PWD,
  DATABASE_PORT, DS_SYNC,
} from './dotenv';
import { UserSubscriber } from '../subscribers/UserSubscriber';

export const AppDataSource = new DataSource({
  type: 'postgres',
  username: DATABASE_ROLE,
  host: DATABASE_HOST,
  password: DATABASE_PWD,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  entities: [`${__dirname}/../entities/*.{ts,js}`],
  synchronize: DS_SYNC,
  subscribers: [UserSubscriber],
});

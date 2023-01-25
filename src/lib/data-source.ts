import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  DATABASE_ROLE, DATABASE_HOST, DATABASE_NAME, DATABASE_PWD,
  DATABASE_PORT, DS_SYNC,
} from './dotenv';
import { UserSubscriber } from '../subscribers/user.subscriber';
import User from '../entities/user';
import Session from '../entities/session';

let appDataSource: DataSource | null = null;
const initializeDataSource = () => {
  appDataSource = new DataSource({
    type: 'postgres',
    username: DATABASE_ROLE,
    host: DATABASE_HOST,
    password: DATABASE_PWD,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    entities: [Session, User],
    synchronize: DS_SYNC,
    subscribers: [UserSubscriber],
  });

  return appDataSource;
};

export const getAppDataSource = async (): Promise<DataSource> => {
  if (appDataSource?.initialize()) return appDataSource;

  const datasource: DataSource = initializeDataSource();
  return datasource.initialize();
};

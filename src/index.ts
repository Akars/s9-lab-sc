import 'reflect-metadata';
import { FASTIFY_ADDR, FASTIFY_PORT } from './lib/Dotenv';
import { server } from './lib/Fastify';
import { AppDataSource } from './lib/DataSource';

async function run() {
  await AppDataSource.initialize();
  await server.listen({ port: FASTIFY_PORT, host: FASTIFY_ADDR });
}

// eslint-disable-next-line no-console
run().catch(console.error);

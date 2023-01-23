import 'reflect-metadata';
import { FASTIFY_ADDR, FASTIFY_PORT } from './lib/dotenv';
import { server } from './lib/fastify';
import { AppDataSource } from './lib/data-source';

async function run() {
  await AppDataSource.initialize();
  await server.listen({ port: FASTIFY_PORT, host: FASTIFY_ADDR });
}

// eslint-disable-next-line no-console
run().catch(console.error);

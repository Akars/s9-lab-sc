import fastify from 'fastify';
import { userRoutes } from '../routes/web-api/UserRoutes';

export const server = fastify({ logger: false })
  .register(userRoutes, { prefix: '/web-api' });

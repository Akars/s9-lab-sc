import fastify, { RouteOptions } from 'fastify';
import { usersRoutes } from '../routes/web-api/users-routes';

export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
  if (!routeOptions.schema) {
    throw new Error(`Schema not found for route ${routeOptions.url}`);
  }
}

export const server = fastify({ logger: false })
  .addHook('onRoute', assertsResponseSchemaPresenceHook)
  .register(usersRoutes, { prefix: '/web-api' });

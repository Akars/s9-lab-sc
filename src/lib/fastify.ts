import fastify, {
  FastifyError, FastifyReply, FastifyRequest, RouteOptions,
} from 'fastify';
import { ValidationError } from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import { usersRoutes } from '../routes/web-api/users-routes';
import { sessionsRoutes } from '../routes/web-api/sessions-routes';

export const assertsResponseSchemaPresenceHook = (routeOptions: RouteOptions) => {
  if (!routeOptions.schema?.response) {
    throw {
      statusCode: 500,
      name: 'Internal Server Error',
      message: `Response schema not found for route ${routeOptions.url}`,
    };
  }
};

export const assertsValidationSchemaPresenceHook = (routeOptions: RouteOptions) => {
  if (!(routeOptions.schema?.body || routeOptions.schema?.params || routeOptions.schema?.params)) {
    throw {
      statusCode: 500,
      name: 'Internal Server Error',
      message: `Validation schema not found for route ${routeOptions.url}`,
    };
  }
};

export const errorHandleHook = (error: FastifyError, req: FastifyRequest, res: FastifyReply) => {
  if (error instanceof ValidationError) {
    res.status(400).send({ error: error.constraints });
  }
  if (error instanceof EntityNotFoundError) {
    res.status(400).send({ error: error.message });
  }

  switch (true) {
    case error.message.startsWith('Validation schema not found for route') || error.message.startsWith('Response schema not found for route'):
      res.status(400).send({ error: error.message });
      break;
    case process.env.NODE_ENV === 'production' && (error.statusCode && error.statusCode >= 500):
      res.status(500).send({ error: 'Internal Server Error' });
      break;
    default:
      res.status(500).send({ error: error.message });
  }
};

export const server = fastify({
  logger: false,
  ajv: {
    customOptions: {
      removeAdditional: false, // body must NOT have additional properties
    },
  },
})
  .addHook('onRoute', assertsResponseSchemaPresenceHook)
  .addHook('onRoute', assertsValidationSchemaPresenceHook)
  .register(cookie, {
    secret: 'test',
    parseOptions: {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
  } as FastifyCookieOptions)
  .decorateRequest('session', null)
  .decorateRequest('user', null)
  .register(usersRoutes, { prefix: '/web-api' })
  .register(sessionsRoutes, { prefix: '/web-api' })
  .setErrorHandler(errorHandleHook);

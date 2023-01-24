import fastify, {
  FastifyError, FastifyReply, FastifyRequest, RouteOptions,
} from 'fastify';
import { usersRoutes } from '../routes/web-api/users-routes';

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
  if (error.message.startsWith(`${'Validation' || 'Response'} schema not found for route`)) {
    res.status(400).send({ error: error.message });
  }
  if (process.env.NODE_ENV === 'production' && (error.statusCode && error.statusCode >= 500)) {
    res.status(500).send({ error: 'Internal Server Error' });
  } else {
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
  .register(usersRoutes, { prefix: '/web-api' })
  .setErrorHandler(errorHandleHook);

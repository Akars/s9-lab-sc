import fastify, {
  FastifyError, RouteOptions,
} from 'fastify';
import { usersRoutes } from '../routes/web-api/users-routes';

export const assertsResponseSchemaPresenceHook = (routeOptions: RouteOptions) => {
  if (!routeOptions.schema?.response) {
    const error : FastifyError = {
      code: '500',
      name: 'Internal Error',
      message: `Response schema not found for route ${routeOptions.url}`,
    };
    throw error;
  }
};

export const assertsValidationSchemaPresenceHook = (routeOptions: RouteOptions) => {
  if (!(routeOptions.schema?.body || routeOptions.schema?.params || routeOptions.schema?.params)) {
    const error : FastifyError = {
      code: '500',
      name: 'Internal Error',
      message: `Validation schema not found for route ${routeOptions.url}`,
    };
    throw error;
  }
};

/* exercise 7
  export const errorHandleHook = (error: FastifyError, req: FastifyRequest, res: FastifyReply) => {
    if (error instanceof ValidationError) {
      res.status(400).send({
        code: '400',
      });
    }
    if (error.code && error.message.startsWith('Schema not found for route')) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message });
    }
  };
*/

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
  .register(usersRoutes, { prefix: '/web-api' });
  // .setErrorHandler(errorHandleHook);

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fastify, { FastifyInstance } from 'fastify';
import {
  assertsResponseSchemaPresenceHook,
  assertsValidationSchemaPresenceHook,
  errorHandleHook,
} from '../../../lib/fastify';

chai.use(chaiAsPromised);

describe('Web hook', () => {
  describe('onRoute hook', () => {
    it('should throw an error if route has no response schema', async () => {
      const unsafeRoute = async (route: FastifyInstance) => {
        route.post(
          '/un-safe',
          {
            schema: {
              body: {
                properties: {
                  foo: 'bar',
                },
              },
            },
          },
          () => true,
        );
      };

      const serverTest = fastify()
        .addHook('onRoute', assertsResponseSchemaPresenceHook)
        .register(unsafeRoute);

      await chai.expect(serverTest).to
        .eventually.be.rejected
        .and.deep.include({
          statusCode: 500,
          name: 'Internal Server Error',
          message: 'Response schema not found for route /un-safe',
        });
    });
    it('should throw an error if route has no body || query || params schema', async () => {
      // eslint-disable-next-line no-restricted-syntax

      const unsafeRoute = async (route: FastifyInstance) => {
        route.post(
          '/un-safe',
          {
            schema: {
              response: {
                properties: {
                  foo: 'bar',
                },
              },
            },
          },
          () => true,
        );
      };

      const serverTest = fastify()
        .addHook('onRoute', assertsValidationSchemaPresenceHook)
        .register(unsafeRoute);

      await chai.expect(serverTest).to
        .eventually.be.rejected
        .and.deep.include({
          statusCode: 500,
          name: 'Internal Server Error',
          message: 'Validation schema not found for route /un-safe',
        });
    });

    it(`should fetch the error correctly if statusCode is >= 500 and ${process.env.NODE_ENV} env`, async () => {
      const errorRoute = async (route: FastifyInstance) => {
        route.get(
          '/error',
          () => {
            throw {
              statusCode: 500,
              message: 'Should show the error in dev or test',
            };
          },
        );
      };

      const serverTest = fastify()
        .setErrorHandler(errorHandleHook)
        .register(errorRoute);

      const response = await serverTest.inject({ url: '/error', method: 'GET' });

      chai.expect(response.statusCode).equal(500);
      if (process.env.NODE_ENV === 'production') {
        chai.expect(response.payload).equal('{"error":"Internal Server Error"}');
      } else {
        chai.expect(response.payload).equal('{"error":"Should show the error in dev or test"}');
      }
    });
  });
});

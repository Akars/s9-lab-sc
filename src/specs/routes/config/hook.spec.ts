import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fastify, { FastifyInstance } from 'fastify';
import { assertsResponseSchemaPresenceHook, assertsValidationSchemaPresenceHook } from '../../../lib/fastify';

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
          code: '500',
          name: 'Internal Error',
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
          code: '500',
          name: 'Internal Error',
          message: 'Validation schema not found for route /un-safe',
        });
    });
  });
});

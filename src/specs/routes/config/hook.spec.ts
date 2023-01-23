import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fastify from 'fastify';
import { assertsResponseSchemaPresenceHook } from '../../../lib/fastify';

chai.use(chaiAsPromised);

describe('Web hook', () => {
  const serverTest = fastify()
    .addHook('onRoute', assertsResponseSchemaPresenceHook);

  describe('onRoute hook', () => {
    it('should throw an error if route has no schema', () => {
      chai.assert.throw(() => serverTest.get('/unsafe-route', () => true));
    });
  });
});

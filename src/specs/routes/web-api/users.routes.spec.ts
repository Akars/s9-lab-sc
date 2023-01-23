import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { faker } from '@faker-js/faker';
import { server } from '../../../lib/fastify';

chai.use(chaiAsPromised);

describe('/web-api/users', () => {
  const password = 'privatepassword';

  describe('POST #create', () => {
    it('should register the user', async () => {
      const userBody = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      };

      const response = await server.inject({ url: '/web-api/users', method: 'POST', payload: userBody });

      chai.expect(response.statusCode).eq(200);
    });
  });
});

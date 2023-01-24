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

      chai.expect(response.statusCode).equal(201);
      const user = JSON.parse(response.payload);
      chai.expect(user.lastname).equal(userBody.lastname);
      chai.expect(user.firstname).equal(userBody.firstname);
      chai.expect(user.email).equal(userBody.email);
    });

    it('should throw an error when register with an email taken', async () => {
      const userBody = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      };

      let response = await server.inject({ url: '/web-api/users', method: 'POST', payload: userBody });
      chai.expect(response.statusCode).equal(201);

      response = await server.inject({ url: '/web-api/users', method: 'POST', payload: userBody });
      chai.expect(response.statusCode).equal(400);
      chai.expect(JSON.parse(response.payload)).deep.equal({
        error: {
          UniqueInColumn: 'email already exists',
        },
      });
    });
  });
});

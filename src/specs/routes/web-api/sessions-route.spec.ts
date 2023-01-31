import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { DataSource } from 'typeorm';
import { getAppDataSource } from '../../../lib/data-source';
import { User } from '../../../entities/user';
import { createUserFixture } from '../../fixtures/users-fixtures';
import { Session } from '../../../entities/session';
import { server } from '../../../lib/fastify';

chai.use(chaiAsPromised);

describe('/web-api/sessions', () => {
  let datasource: DataSource;
  let user: User;

  before(async () => {
    datasource = await getAppDataSource();

    // Create a user for test
    user = await createUserFixture();
  });

  beforeEach(async () => {
    await datasource.getRepository(Session).clear();
  });

  describe('POST #create', () => {
    it('should create a session', async () => {
      const credentials = {
        email: user.email,
        password: 'changethat',
      };
      const response = await server.inject({ url: '/web-api/sessions', method: 'POST', payload: credentials });

      chai.expect(response.statusCode).to.be.equal(201);
    });

    it('should create a session after lowering email', async () => {

    });

    it('should reject with 404 if email not found', async () => {
      const credentials = {
        email: 'notfound@email.fr',
        password: 'changethat',
      };
      const response = await server.inject({ url: '/web-api/sessions', method: 'POST', payload: credentials });

      chai.expect(response.statusCode).to.be.equal(404);
    });

    it('should reject with 404 if password does not match', async () => {
      const credentials = {
        email: user.email,
        password: 'wrongpassword',
      };
      const response = await server.inject({ url: '/web-api/sessions', method: 'POST', payload: credentials });

      chai.expect(response.statusCode).to.be.equal(404);
    });
  });
});

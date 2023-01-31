import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { DataSource } from 'typeorm';
import { Session } from 'inspector';
import { getAppDataSource } from '../../../lib/data-source';
import User from '../../../entities/user';
import { createUserFixture } from '../../fixtures/users-fixtures';
import { createSessionFixture } from '../../fixtures/sessions-fixtures';

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
      const session = datasource.getRepository(Session).create();
      session.user = user;
      const response = await datasource
        .getRepository(Session)
        .save(session);
      chai.expect(response.token.length).to.equal(64);
      chai.expect(response.user).to.equal(user);
    });
    it('should create a session after lowering email');
    it('should reject with 404 if email not found');
    it('should reject with 404 if password does not match');
  });
});

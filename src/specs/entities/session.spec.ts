import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DataSource } from 'typeorm';
import { Session } from '../../entities/session';
import { User } from '../../entities/user';
import { getAppDataSource } from '../../lib/data-source';
import { createUserFixture } from '../fixtures/users-fixtures';

chai.use(chaiAsPromised);
describe('Session', () => {
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

  it('should create a session', async () => {
    const session = datasource.getRepository(Session).create();
    session.user = user;
    const response = await datasource.getRepository(Session).save(session);
    chai.expect(response.token.length).to.equal(64);
    chai.expect(response.user).to.equal(user);
  });
});

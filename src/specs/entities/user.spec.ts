import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { QueryFailedError, Repository } from 'typeorm';
import User from '../../entities/user';
import { AppDataSource } from '../../data-source';

chai.use(chaiAsPromised);

describe('User', () => {
  let userRepository: Repository<User>;
  before(async () => {
    await AppDataSource.initialize();
    userRepository = AppDataSource.getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('validations', () => {
    it('should create a new User in database', async () => {
      const user = new User();
      user.email = 'william.li@efrei.net';
      user.firstname = 'william';
      user.lastname = 'li';
      user.passwordHash = 'privatepassword';

      await userRepository.save(user);
      const [retrievedUser] = await userRepository.find({
        where: {
          email: user.email,
        },
      });
      chai.assert.deepEqual(user, retrievedUser);
    });

    it('should raise error if email is missing', async () => {
      const user = new User();
      user.firstname = 'william';
      user.lastname = 'li';
      user.passwordHash = 'privatepassword';

      await chai.expect(userRepository.save(user)).to.eventually.be.rejected.and.deep.include({
        target: user,
        property: 'email',
        constraints: { isNotEmpty: 'email should not be empty' },
      });
    });
  });
});

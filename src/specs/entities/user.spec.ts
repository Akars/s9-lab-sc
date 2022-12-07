import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { QueryFailedError, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
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
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        passwordHash: 'password',
      });

      await userRepository.save(user);
      const [retrievedUser] = await userRepository.find({
        where: {
          email: user.email,
        },
      });
      chai.assert.deepEqual(user, retrievedUser);
    });

    it('should raise error if email is missing', async () => {
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        passwordHash: 'password',
      });

      await chai.expect(userRepository.save(user)).to.eventually.be.rejected.and.deep.include({
        target: user,
        property: 'email',
        constraints: { isNotEmpty: 'email should not be empty' },
      });
    });
  });
});

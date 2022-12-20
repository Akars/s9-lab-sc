import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ValidationError } from 'class-validator';
import User from '../../entities/User';
import { AppDataSource } from '../../DataSource';
import { SetPasswordDTO } from '../../lib/SetPasswordDTO';

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
      const password = 'privatepassword';
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      const passwordDTO = new SetPasswordDTO(password, password);
      await user.setPassword(passwordDTO);

      await userRepository.save(user);
      chai.expect(userRepository.hasId(user));
    });

    it('should raise error if email is missing', async () => {
      const password = 'privatepassword';
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
      });

      const passwordDTO = new SetPasswordDTO(password, password);
      await user.setPassword(passwordDTO);

      await chai.expect(userRepository.save(user)).to.eventually.be.rejected.and.deep.include({
        target: user,
        property: 'email',
        constraints: { isNotEmpty: 'email should not be empty' },
      });
    });

    it('should raise error if email exist', async () => {
      const password = 'privatepassword';
      const email = faker.internet.email();
      let user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email,
      });

      const passwordDTO = new SetPasswordDTO(password, password);
      await user.setPassword(passwordDTO);

      await userRepository.save(user);

      user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: email.toUpperCase(),
        passwordHash: 'password',
      });

      await chai.expect(userRepository.save(user)).to.eventually.be.rejected.and.deep.include({
        target: user,
        property: 'email',
        value: email.toUpperCase(),
        constraints: { UniqueInColumn: 'email already exists' },
      });
    });

    it('should raise error if password does not match', async () => {
      const password = 'privatepassword';
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      const passwordDTO = new SetPasswordDTO(password, 'anotherPassword');
      await chai.expect(user.setPassword(passwordDTO)).to.eventually
        .be.rejected
        .and.be.an.instanceOf(ValidationError);
    });
  });
});

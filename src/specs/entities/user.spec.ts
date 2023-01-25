import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ValidationError } from 'class-validator';
import User from '../../entities/user';
import { getAppDataSource } from '../../lib/data-source';
import { SetPasswordDto } from '../../lib/set-password-dto';
import { computePasswordEntropy } from '../../lib/password-entropy';

chai.use(chaiAsPromised);

describe('User', () => {
  let userRepository: Repository<User>;
  const password = 'privatepassword';
  before(async () => {
    userRepository = (await getAppDataSource()).getRepository(User);
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
      });

      const passwordDTO = new SetPasswordDto(password, password);
      await user.setPassword(passwordDTO);

      await userRepository.save(user);
      chai.expect(userRepository.hasId(user));
    });

    it('should raise error if email is missing', async () => {
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
      });

      const passwordDTO = new SetPasswordDto(password, password);
      await user.setPassword(passwordDTO);

      await chai.expect(userRepository.save(user)).to.eventually.be.rejected.and.deep.include({
        target: user,
        property: 'email',
        constraints: { isNotEmpty: 'email should not be empty' },
      });
    });

    it('should raise error if email exist', async () => {
      const email = faker.internet.email();
      let user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email,
      });

      const passwordDTO = new SetPasswordDto(password, password);
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
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      const passwordDTO = new SetPasswordDto(password, 'anotherPassword');
      await chai.expect(user.setPassword(passwordDTO)).to.eventually
        .be.rejected
        .and.be.an.instanceOf(ValidationError);
    });

    it('should pass if the password match the hashed password', async () => {
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      const passwordDTO = new SetPasswordDto(password, password);
      await user.setPassword(passwordDTO);

      await chai.expect(user.isPasswordValid(password)).to
        .not.be.rejected
        .and.be.true;
    });

    it('should raise error if the password does not match the hashed password', async () => {
      const user = userRepository.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      const passwordDTO = new SetPasswordDto(password, password);
      await user.setPassword(passwordDTO);

      await chai.expect(user.isPasswordValid('password')).to
        .not.be.rejected
        .and.be.false;
    });
  });
  describe('Password strength validation', () => {
    it('should return 18.8 bits for \'test\' as password', () => {
      chai.expect(computePasswordEntropy('test')).to.be.closeTo(18.8, 0.1);
    });

    it('should pass if the password has 80 bits of entropy', () => {
      const securedPassword = 'P4sS0rWd.1234@';

      chai.expect(computePasswordEntropy(securedPassword)).to.be.greaterThanOrEqual(80);
    });
  });
});

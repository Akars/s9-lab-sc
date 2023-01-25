// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import User from '../../entities/user';
import { getAppDataSource } from '../../lib/data-source';

type UserFixtureOptions = Partial<Pick<User, 'firstname' | 'lastname' | 'email'>>;

export function buildUserFixture(opts: UserFixtureOptions = {}) {
  const user = new User();
  user.firstname = opts.firstname ?? faker.name.firstName();
  user.lastname = opts.lastname ?? faker.name.lastName();
  user.email = opts.email ?? faker.internet.email();

  // that hash matches password 'changethat', hardcoded so we save CPU hashing time
  user.passwordHash = '$2a$12$dm2t30Y07Mt9TklkLOuy.efFIJ69WTW3f7NmwH8uioX9R6NHMQSXO';

  return user;
}

export async function createUserFixture(opts: UserFixtureOptions = {}) {
  return (await getAppDataSource()).getRepository(User).save(buildUserFixture(opts));
}

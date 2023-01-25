import Session from '../../entities/session';
import User from '../../entities/user';
import { buildUserFixture } from './users-fixtures';
import { getAppDataSource } from '../../lib/data-source';

type SessionFixtureOptions = { user?: User };

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
  const session = new Session();
  session.user = opts.user ?? buildUserFixture();
  return session;
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
  return (await getAppDataSource()).getRepository(Session).save(buildSessionFixture(opts));
}

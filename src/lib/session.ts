import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Session } from '../entities/session';
import { User } from '../entities/user';
import { getAppDataSource } from './data-source';

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session | null
    user?: User | null
  }
}

export async function saveSession(reply: FastifyReply, user: User) {
  // create a new session
  const sessionRepository = (await getAppDataSource()).getRepository(Session);
  const newSession = sessionRepository.create();
  newSession.user = user;
  const session = await sessionRepository.save(newSession);
  reply.setCookie('token', session.token, {
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  } as CookieSerializeOptions);
}

export async function loadSession(reply: FastifyReply, request: FastifyRequest) {
  if (!request.cookies.token) return;

  const token = request.unsignCookie(request.cookies.token);
  if (!token.valid) reply.status(401).send({ message: 'Session is not valid' });

  request.session = await (await getAppDataSource()).getRepository(Session).findOneOrFail({
    where: { token: token.value! },
    relations: { user: true },
  });

  if (request.session.expiresAt < new Date()) {
    reply.status(401).send({ message: 'Session expired' });
  }
  if (request.session.revokedAt && request.session.revokedAt < new Date()) {
    reply.status(401).send({ message: 'Session revoked' });
  }

  request.user = request.session.user;
}

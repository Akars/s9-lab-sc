import { FastifyInstance } from 'fastify';
import createSessionRequestSchema from '../../schemas/json/session-request.json';
import createSessionResponseSchema from '../../schemas/json/session-response.json';
import { CreateSessionRequestBody } from '../../schemas/types/session-request';
import { CreateSessionResponseBody } from '../../schemas/types/session-response';
import { getAppDataSource } from '../../lib/data-source';
import { User } from '../../entities/user';
import { Session } from '../../entities/session';

export async function sessionsRoutes(fastify :FastifyInstance) {
  fastify.post<
  { Body: CreateSessionRequestBody, Response: CreateSessionResponseBody }>(
    '/sessions',
    {
      schema: {
        body: createSessionRequestSchema,
        response: {
          201: createSessionResponseSchema,
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body;

      // check if the email and password are valid
      if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
      }

      // check if the user exists and the password is correct
      const userRepository = (await getAppDataSource()).getRepository(User);
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(404).send({ message: 'Email not found' });
      }

      if (!(await user.isPasswordValid(password))) {
        return res.status(404).send({ message: 'Invalid password' });
      }

      // create a new session
      const session = new Session();
      session.user = user;
      session.generateToken();
      const sessionRepository = (await getAppDataSource()).getRepository(Session);
      await sessionRepository.save(session);

      // return the session token
      return res.code(201).send({ token: session.token });
    },
  );
}

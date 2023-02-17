import { FastifyInstance } from 'fastify';
import createSessionRequestSchema from '../../schemas/json/session-request.json';
import createSessionResponseSchema from '../../schemas/json/user-response.json';
import { CreateSessionRequestBody } from '../../schemas/types/session-request';
import { CreateSessionResponseBody } from '../../schemas/types/session-response';
import { getAppDataSource } from '../../lib/data-source';
import { User } from '../../entities/user';
import { saveSession } from '../../lib/session';

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

      // check if the user exists and the password is correct
      const userRepository = (await getAppDataSource()).getRepository(User);
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(404).send({ message: 'Email not found' });
      }

      if (!(await user.isPasswordValid(password))) {
        return res.status(404).send({ message: 'Invalid password' });
      }

      // return the session token
      await saveSession(res, user);

      return res.code(201).send({
        firstname: user.firstname, lastname: user.lastname, id: user.id, email: user.email,
      });
    },
  );
}

import { FastifyInstance } from 'fastify';
import createUserRequestSchema from '../../schemas/json/user-request.json';
import createUserResponseSchema from '../../schemas/json/user-response.json';
import { CreateUserRequestBody } from '../../schemas/types/user-request';
import { CreateUserResponseBody } from '../../schemas/types/user-response';
import { AppDataSource } from '../../lib/data-source';
import User from '../../entities/user';
import { SetPasswordDto } from '../../lib/set-password-dto';

export async function usersRoutes(fastify :FastifyInstance) {
  fastify.post<
  { Body: CreateUserRequestBody, Response: CreateUserResponseBody }>(
    '/users',
    {
      schema: {
        body: createUserRequestSchema,
        response: {
          201: createUserResponseSchema,
        },
      },
    },
    async (req, res) => {
      const {
        email, firstname, lastname, password, passwordConfirmation,
      } = req.body;

      const repo = AppDataSource.getRepository(User);
      const user = new User();

      user.email = email;
      user.firstname = firstname;
      user.lastname = lastname;

      await user.setPassword(new SetPasswordDto(password, passwordConfirmation));

      await repo.save(user);

      res.code(201).send({
        firstname: user.firstname, lastname: user.lastname, id: user.id, email: user.email,
      });
    },
  );
}

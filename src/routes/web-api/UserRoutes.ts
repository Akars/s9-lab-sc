import { FastifyInstance } from 'fastify';
import BodySchema from '../../schemas/UserRequest.json';
import { CreateUserRequestBody as BodySchemaInterface } from '../../types/UserRequest';
import { AppDataSource } from '../../lib/DataSource';
import User from '../../entities/User';
import { SetPasswordDTO } from '../../lib/SetPasswordDTO';

export async function userRoutes(fastify :FastifyInstance) {
  fastify.post<
  { Body: BodySchemaInterface }>(
    '/users',
    {
      schema: {
        body: BodySchema,
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

      await user.setPassword(new SetPasswordDTO(password, passwordConfirmation));

      await repo.save(user);

      await res.send().status(200);
    },
  );
}

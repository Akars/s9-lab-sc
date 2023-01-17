import { FastifyPluginCallback } from 'fastify';
import * as QuerystringSchema from '../../schemas/UserRequest.json';
import { CreateUserRequestBody as QuerystringSchemaInterface } from '../../types/UserRequest';
import { AppDataSource } from '../../lib/DataSource';
import User from '../../entities/User';
import { SetPasswordDTO } from '../../lib/SetPasswordDTO';

export const userRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.post<{ Querystring: QuerystringSchemaInterface }>('/users', {
    schema: {
      querystring: QuerystringSchema,
    },
  }, async (req, res) => {
    const {
      email, firstname, lastname, password, passwordConfirmation,
    } = req.query;

    const repo = AppDataSource.getRepository(User);
    const user = new User();

    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;

    await user.setPassword(new SetPasswordDTO(password, passwordConfirmation));

    await repo.save(user);

    await res.status(200);
  });

  done();
};

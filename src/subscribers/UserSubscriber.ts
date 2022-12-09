import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent,
} from 'typeorm';
import { validate } from 'class-validator';
import User from '../entities/user';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  // eslint-disable-next-line class-methods-use-this
  listenTo() {
    return User;
  }

  // eslint-disable-next-line class-methods-use-this
  async beforeInsert(event: InsertEvent<User>) {
    const [error] = await validate(event.entity);
    if (error) throw error;
  }
}

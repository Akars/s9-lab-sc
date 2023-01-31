import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent,
} from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entities/user';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const [error] = await validate(event.entity);
    if (error) throw error;
  }
}

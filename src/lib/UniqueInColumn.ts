import 'reflect-metadata';
import {
  registerDecorator, ValidationOptions, ValidationArguments,
  ValidatorConstraintInterface, ValidatorConstraint,
} from 'class-validator';
import { Container } from 'typedi';
import { Manager } from './DatasourceManager';
import User from '../entities/user';

@ValidatorConstraint({ name: 'UniqueInColumn', async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const serviceInstance = Container.get(Manager);

    const userManager = serviceInstance.injectedResources.getRepository();

    return userManager.find(User, { where: { email: value as string } }).then(([user]) => !user);
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line func-names
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'UniqueInColumn',
      target: object.constructor,
      propertyName,
      options: validationOptions || {
        message: `${propertyName} already exists`,
      },
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}

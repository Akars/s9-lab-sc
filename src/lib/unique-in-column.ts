import 'reflect-metadata';
import {
  registerDecorator, ValidationOptions, ValidationArguments,
  ValidatorConstraintInterface, ValidatorConstraint,
} from 'class-validator';
import { Container } from 'typedi';
import { Manager } from './data-source-manager';
import User from '../entities/user';

@ValidatorConstraint({ name: 'UniqueInColumn', async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    // Injection of the dependency from data-source-manager.ts
    const serviceInstance = Container.get(Manager);

    const dataSourceManager = serviceInstance.injectedResources.getDataSourceManager();

    return dataSourceManager
      .find(User, { where: { email: value as string } })
      .then(([user]) => !user);
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
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

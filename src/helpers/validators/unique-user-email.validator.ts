import { UsersService } from './../../users/users.service';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUserEmailValidatorConstruct
  implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}
  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;
    const user = await this.usersService.findUserByEmail({ email: value });
    return !Boolean(user);
  }
}

export function UniqueUserEmailValidator(
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUserEmailValidatorConstruct,
    });
  };
}

import { UsersService } from '../../users/users.service';
import { Inject, PipeTransform } from '@nestjs/common';

export class ExistUserPipe implements PipeTransform {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async transform(value: string) {
    const user = await this.usersService.findOneUser({ id: value });
    return value;
  }
}

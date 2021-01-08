import { UsersService } from '../../users/users.service';
import {
  BadRequestException,
  Inject,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

export class ExistUserPipe implements PipeTransform {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async transform(value: string) {
    try {
      const user = await this.usersService.findOneUser({ id: value });
      if (user) {
        return value;
      }
      throw new NotFoundException('Указан несуществующий id пользователя');
    } catch (e) {
      throw new BadRequestException('Некорректно указан id пользователя');
    }
  }
}

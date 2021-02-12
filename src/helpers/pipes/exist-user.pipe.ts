import { User } from 'src/helpers/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ExistUserPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async transform(value: string) {
    try {
      const user = await this.userModel.findById(value);
      if (!user) {
        throw new NotFoundException(
          `Пользователя с id ${value} нет в базе данных`,
        );
      }

      return value;
    } catch (e) {
      throw new BadRequestException(
        `Не корректно указан id ${value} пользователя`,
      );
    }
  }
}

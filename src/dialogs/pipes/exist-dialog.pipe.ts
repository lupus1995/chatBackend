import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';

@Injectable()
export class ExistsDialogPipe implements PipeTransform {
  constructor(
    @InjectModel(Dialogs.name) private dialogsModel: Model<Dialogs>,
  ) {}
  async transform(value: string) {
    try {
      const dialog = await this.dialogsModel.findOne({ _id: value });
      if (!dialog) {
        throw new NotFoundException(`Диалога с id ${value} нет в базе данных`);
      }
      return value;
    } catch (e) {
      throw new BadRequestException(`Не корректно указан id ${value} даилога`);
    }
  }
}

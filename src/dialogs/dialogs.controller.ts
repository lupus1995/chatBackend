import { DialogsService } from './dialogs.service';
import { Controller, Get, Param } from '@nestjs/common';
import { GetAllDialogsInterface } from './dialogs.interface';

@Controller('dialogs')
export class DialogsController {
  constructor(private dialogService: DialogsService) {}
  // загрузка диалогов в левой колонке
  @Get(':id')
  async findAll(@Param('id') id: string): Promise<GetAllDialogsInterface[]> {
    return await this.dialogService.findAll({ userId: id });
  }

  // создание диалога

  // удаление диалога

  // редактирование диалога
}

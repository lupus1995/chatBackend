import { CreateDialogDto, UpdateDialogDto } from './dto/create-dialog.dto';
import { DialogsService } from './dialogs.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetAllDialogsInterface } from './dialogs.interface';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';

@Controller('dialogs')
export class DialogsController {
  constructor(private dialogService: DialogsService) {}
  // загрузка диалогов в левой колонке
  @Get(':id')
  async findAll(@Param('id') id: string): Promise<GetAllDialogsInterface[]> {
    return await this.dialogService.findAll({ userId: id });
  }

  // создание диалога
  @Post()
  async create(@Body() createDialogDto: CreateDialogDto): Promise<Dialogs> {
    return await this.dialogService.createDialog(createDialogDto);
  }

  // редактирование диалога
  @Put()
  async update(@Body() updateDialogDto: UpdateDialogDto): Promise<Dialogs> {
    return await this.dialogService.updateDialog(updateDialogDto);
  }

  // удаление диалога
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Dialogs> {
    return await this.dialogService.deleteDialog({ dialogId: id });
  }
}

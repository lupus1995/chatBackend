import { CreateDialogDto, UpdateDialogDto } from './create-dialog.dto';
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('dialogs')
@Controller('dialogs')
export class DialogsController {
  constructor(private dialogService: DialogsService) {}
  // загрузка диалогов в левой колонке
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Получение информации об диалогах',
  })
  async findAll(@Param('id') id: string): Promise<GetAllDialogsInterface[]> {
    return await this.dialogService.findAll({ userId: id });
  }

  // создание диалога
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Создание диалога',
  })
  async create(@Body() createDialogDto: CreateDialogDto): Promise<Dialogs> {
    return await this.dialogService.createDialog(createDialogDto);
  }

  // редактирование диалога
  @Put()
  @ApiResponse({
    description: 'Редактирование диалога',
    status: 200,
  })
  async update(@Body() updateDialogDto: UpdateDialogDto): Promise<Dialogs> {
    return await this.dialogService.updateDialog(updateDialogDto);
  }

  // удаление диалога
  @Delete(':id')
  @ApiResponse({
    description: 'Удаление диалога',
    status: 200,
  })
  async delete(@Param('id') id: string): Promise<Dialogs> {
    return await this.dialogService.deleteDialog({ dialogId: id });
  }
}

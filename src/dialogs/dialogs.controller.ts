import { CreateDialogDto } from './create-dialog.dto';
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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiParam({
    name: 'id',
    description: 'Id пользователя',
    required: true,
    type: String,
  })
  async findAll(@Param('id') id: string) {
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
  @Put(':id')
  @ApiResponse({
    description: 'Редактирование диалога',
    status: 200,
  })
  @ApiParam({
    name: 'id',
    description: 'Id диалога',
    required: true,
    type: String,
  })
  async update(
    @Body() updateDialogDto: CreateDialogDto,
    @Param('id') id: string,
  ): Promise<Dialogs> {
    return await this.dialogService.updateDialog({
      ...updateDialogDto,
      _id: id,
    });
  }

  // удаление диалога
  @Delete(':id')
  @ApiResponse({
    description: 'Удаление диалога',
    status: 200,
  })
  @ApiParam({
    name: 'id',
    description: 'Id диалога',
    required: true,
    type: String,
  })
  async delete(@Param('id') id: string): Promise<Dialogs> {
    return await this.dialogService.deleteDialog({ dialogId: id });
  }
}

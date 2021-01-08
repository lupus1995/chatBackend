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
  UsePipes,
} from '@nestjs/common';
import { GetAllDialogsInterface } from './dialogs.interface';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/helpers/schemas/user.schema';
import { ExistUserPipe } from 'src/helpers/pipes/exist-user.pipe';
import { ValidateDialogPipe } from './pipes/validate-dialog.pipe';

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
  @ApiResponse({
    description: 'Ошибка в параметрах запроса',
    status: 400,
  })
  @ApiResponse({
    description: 'Пользователь не найден в базе данных',
    status: 404,
  })
  @ApiParam({
    name: 'id',
    description: 'Id пользователя',
    required: true,
    type: String,
  })
  async findAll(
    @Param('id', ExistUserPipe) id: string,
  ): Promise<GetAllDialogsInterface[]> {
    return await this.dialogService.findAll({ userId: id });
  }

  // создание диалога
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Создание диалога',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка в параметрах запроса',
  })
  @UsePipes(ValidateDialogPipe)
  async create(
    @Body() createDialogDto: CreateDialogDto,
  ): Promise<GetAllDialogsInterface> {
    return await this.dialogService.createDialog(createDialogDto);
  }

  // редактирование диалога
  @Put(':id')
  @ApiResponse({
    description: 'Редактирование диалога',
    status: 200,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка в параметрах запроса',
  })
  @ApiResponse({
    status: 404,
    description: 'Диалога нет в базе данных',
  })
  @ApiParam({
    name: 'id',
    description: 'Id диалога',
    required: true,
    type: String,
  })
  @UsePipes(ValidateDialogPipe)
  async update(
    @Body() updateDialogDto: CreateDialogDto,
    @Param('id', ExistUserPipe) id: string,
  ) {
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
  @ApiResponse({
    status: 404,
    description: 'Диалога нет в базе данных',
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

  // получение пользователей для создания диалога
  @Get('/members/:id')
  @ApiResponse({
    description: 'Получение пользователей для создания диалога',
    status: 200,
  })
  @ApiResponse({
    description: 'Пользователь не найден в базе данных',
    status: 404,
  })
  async usersForCreateDialog(
    @Param('id', ExistUserPipe) id: string,
  ): Promise<User[]> {
    return await this.dialogService.getMembersForCreateDialog({ userId: id });
  }
}

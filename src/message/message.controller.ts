import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import { Message } from 'src/helpers/schemas/message.schema';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  // получение сообщений диалога
  @Get('id')
  @ApiResponse({
    description: 'Получение сообщения диалога',
    status: 200,
  })
  async findAll(@Param('id') id: string) {
    return await this.messageService.findAll({ dialogId: id });
  }
  // создание сообщений диалога
  @Post()
  @ApiResponse({
    description: 'Создание сообщения в диалоге',
    status: 201,
  })
  async create(@Body() message: CreateMessageDto): Promise<Message> {
    return await this.messageService.createMessage({ message });
  }

  // редактирование сообщений диалога
  @Put()
  @ApiResponse({
    description: 'Редактирование сообщения в диалоге',
    status: 200,
  })
  async update(@Body() message: UpdateMessageDto): Promise<Message> {
    return await this.messageService.updateMessage({ message });
  }
  // удаление сообщений диалога
  @Delete('id')
  @ApiResponse({
    description: 'Удаление сообщения',
    status: 200,
  })
  async delete(@Param('id') id: string): Promise<Message> {
    return await this.messageService.deleteMessage({ messageId: id });
  }
}

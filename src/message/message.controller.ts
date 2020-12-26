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

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  // получение сообщений диалога
  @Get('id')
  async findAll(@Param('id') id: string) {
    return await this.messageService.findAll({ dialogId: id });
  }
  // создание сообщений диалога
  @Post()
  async create(@Body() message: CreateMessageDto): Promise<Message> {
    return await this.messageService.createMessage({ message });
  }

  // редактирование сообщений диалога
  @Put()
  async update(@Body() message: UpdateMessageDto): Promise<Message> {
    return await this.messageService.updateMessage({ message });
  }
  // удаление сообщений диалога
  @Delete('id')
  async delete(@Param('id') id: string): Promise<Message> {
    return await this.messageService.deleteMessage({ messageId: id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/helpers/schemas/message.schema';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findAll({ dialogId }: { dialogId: string }): Promise<Message[]> {
    return await this.messageModel.find({ dialogsId: dialogId });
  }

  async createMessage({
    message,
  }: {
    message: CreateMessageDto;
  }): Promise<Message> {
    const messageModel = new this.messageModel(message);
    return await messageModel.save();
  }

  async updateMessage({
    message,
  }: {
    message: UpdateMessageDto;
  }): Promise<Message> {
    return await this.messageModel.findByIdAndUpdate(message._id, {
      ...message,
    });
  }

  async deleteMessage({ messageId }: { messageId: string }): Promise<Message> {
    return await this.messageModel.findByIdAndDelete(messageId);
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getUnixTime } from 'date-fns';
import { Document } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

@Schema()
export class Message extends Document {
  @Prop({
    type: 'String',
    required: true,
  })
  dialogsId: string;

  @Prop({
    type: 'String',
    required: true,
  })
  senderId: string;

  @Prop({
    type: 'String',
    required: true,
  })
  recipient: string;

  @Prop({
    type: 'Boolean',
    default: false,
  })
  read: boolean;

  @Prop({
    type: 'String',
    required: true,
  })
  message: string;

  @Prop({
    type: 'Number',
    required: true,
  })
  createdAt: number;

  @Prop({
    type: 'Number',
    required: true,
  })
  updatedAt: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message)
  .plugin(mongooseUniqueValidator)
  .pre<Message>('save', async function(next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const message = this;
    message.read = false;
    message.createdAt = getUnixTime(new Date());
    message.updatedAt = getUnixTime(new Date());
    next();
  });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getUnixTime } from 'date-fns';
import { Document, HookNextFunction, Types } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { Message } from './message.schema';
import { User } from './user.schema';

@Schema()
export class Dialogs extends Document {
  @Prop({
    type: 'String',
    required: true,
    enum: ['dialog', 'chat'],
    default: 'dialog',
  })
  type: string;
  @Prop({
    type: [Types.ObjectId],
    ref: User.name,
    required: true,
  })
  members: User[];

  @Prop({
    type: [Types.ObjectId],
    ref: Message.name,
  })
  messages: Message[];
  @Prop({
    type: 'Number',
  })
  createdAt: number;
  @Prop({
    type: 'Number',
  })
  updatedAt: number;
}

const DialogsSchema = SchemaFactory.createForClass(Dialogs)
  .plugin(mongooseUniqueValidator)
  .pre<Dialogs>('save', async function(next: HookNextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const dialog = this;
    dialog.createdAt = getUnixTime(new Date());
    dialog.updatedAt = getUnixTime(new Date());
    next();
  });

export { DialogsSchema };

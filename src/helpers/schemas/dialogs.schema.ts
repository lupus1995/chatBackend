import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getUnixTime } from 'date-fns';
import { Document, HookNextFunction } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

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
    type: ['String'],
    required: true,
  })
  members: string[];
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

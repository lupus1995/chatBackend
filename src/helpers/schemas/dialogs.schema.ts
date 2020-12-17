import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
    required: true,
  })
  createdAt: number;
  @Prop({
    type: 'Number',
    required: true,
  })
  updatedAt: number;
}

export const DialogsSchema = SchemaFactory.createForClass(Dialogs).plugin(
  mongooseUniqueValidator,
);

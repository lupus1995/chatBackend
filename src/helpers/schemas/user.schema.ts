import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseUniqueValidatoe from 'mongoose-unique-validator';

@Schema()
export class User extends Document {
  @Prop({
    type: 'String',
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  })
  login: string;

  @Prop({
    type: 'String',
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: 'String', unique: true })
  hashUrl: string;

  @Prop({
    type: 'String',
  })
  name: string;

  @Prop({
    type: 'String',
  })
  surname: string;

  @Prop({
    type: 'String',
  })
  patronimic: string;

  @Prop({
    type: 'String',
  })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User).plugin(
  mongooseUniqueValidatoe,
);

import { UsersInterface } from './user';
import { model, Schema, Document } from 'mongoose';
import { MessageInterface } from './message';

export interface DialogsInterface extends Document {
  _id: Schema.Types.ObjectId;
  type: string;
  members: UsersInterface[];
  messages: MessageInterface[];
  createdAt: number;
  updatedAt: number;
}

export const DialogsSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['dialog', 'chat'],
    default: 'dialog',
  },
  members: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  messages: {
    type: [Schema.Types.ObjectId],
  },
  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
});

const Dialogs = model<DialogsInterface>('Dialogs', DialogsSchema);
export default Dialogs;

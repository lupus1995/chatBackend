import { model, Schema, Document } from 'mongoose';
import { DialogsInterface } from './dialogs';
import { UsersInterface } from './user';

export interface MessageInterface extends Document {
  dialogsId: DialogsInterface;
  senderId: UsersInterface;
  recipientId: UsersInterface;
  read: boolean;
  message: string;
  createdAt: number;
  updatedAt: number;
}

const MessageSchema = new Schema({
  dialogsId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
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

const Messages = model<MessageInterface>('Messages', MessageSchema);
export default Messages;

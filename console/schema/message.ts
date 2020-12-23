import { model, Schema } from 'mongoose';

export interface MessageInterface {
  dialogsId: string;
  senderId: string;
  recipient: string;
  read: boolean;
  message: string;
  createdAt: number;
  updatedAt: number;
}

const MessageSchema = new Schema({
  dialogsId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
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

const Messages = model('Messages', MessageSchema);
export default Messages;

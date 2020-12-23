import { model, Schema } from 'mongoose';

export interface DialogsInterface {
  _id?: string;
  type: string;
  members: string[];
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
    type: [String],
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

const Dialogs = model('Dialogs', DialogsSchema);
export default Dialogs;

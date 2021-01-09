import { Schema, model, Document } from 'mongoose';

export interface UsersInterface extends Document {
  login: string;
  email: string;
  password: string;
  hashUrl?: string;
  name: string;
  surname: string;
  patronimic: string;
  avatar: string;
}

export const UsersSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  },

  password: {
    type: String,
    required: true,
  },

  hashUrl: {
    type: String,
    // unique: true,
    required: false,
    default: null,
    dropDups: true,
  },

  name: {
    type: String,
  },

  surname: {
    type: String,
  },

  patronimic: {
    type: String,
  },

  avatar: {
    type: String,
  },

  hashedRefreshToken: {
    type: String,
    unique: true,
  },
});

const Users = model<UsersInterface>('Users', UsersSchema);
export default Users;

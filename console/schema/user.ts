import { Schema, model } from 'mongoose';

export interface UsersInterface {
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
});

const Users = model('Users', UsersSchema);
export default Users;

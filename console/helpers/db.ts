import { connect } from 'mongoose';
import { MongoError } from 'mongodb';
import logs from './colors';

const uri = 'mongodb://127.0.0.1:27017/chatdb';

connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: MongoError) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(logs.info('Successfully Connected to Mongodb'));
    }
  },
);

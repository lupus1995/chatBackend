import { SMTPServer } from 'smtp-server';
import logs from '../console/helpers/colors';

const server = new SMTPServer({
  onConnect: function(session, callback) {
    console.log('hello');
    callback();
  },
  //   onAuth: function(auth, session, callback) {
  //     callback(null, { user: auth });
  //   },
  onData: function(stream, session, callback) {
    console.log('received');
    callback();
  },
});
server.on('error', err => {
  console.log('Error %s', err.message);
});
server.listen(465, () => {
  console.log(logs.info('smtp server run on port 465'));
});

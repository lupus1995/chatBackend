import { getUnixTime } from 'date-fns';
import Dialogs, { DialogsInterface } from '../schema/dialogs';
import Users from '../schema/user';
import logs from '../helpers/colors';

(async () => {
  let users = await Users.find({}, (err, users) => {
    if (err) {
      console.log(err);
    }
    return users;
  });
  users = users.slice(0, 21);

  const user = users[0];
  const members = users.slice(1, 21);
  const dialogs: DialogsInterface[] = [];

  members.forEach(member => {
    const dialogModel = new Dialogs({
      type: 'dialog',
      members: [user._id, member._id],
      createdAt: getUnixTime(new Date()),
      updatedAt: getUnixTime(new Date()),
      messages: [],
    });
    dialogs.push(dialogModel);
  });

  await Dialogs.insertMany(dialogs, (error: any, docs: DialogsInterface[]) => {
    if (error) {
      console.log(error);
    } else {
      console.log(logs.info('Dialogs saved successfully'));
    }
  });
})();

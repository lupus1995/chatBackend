import { MessageInterface } from '../schema/message';
import Dialogs, { DialogsInterface } from '../schema/dialogs';
import Message from '../schema/message';
import { getUnixTime } from 'date-fns';
import { random } from 'faker';
import logs from '../helpers/colors';

(async () => {
  const dialogsData = ((await Dialogs.find({}, (err, dialogs) => {
    if (err) {
      console.log(err);
    }

    return dialogs;
  })) as unknown) as DialogsInterface[];

  const messages: MessageInterface[] = [];

  dialogsData.forEach((dialog: DialogsInterface) => {
    for (let i = 0; i < 100; i++) {
      if (i % 2 === 0) {
        const message: MessageInterface = {
          dialogsId: dialog._id,
          senderId: dialog.members[0],
          recipient: dialog.members[1],
          createdAt: getUnixTime(new Date()),
          updatedAt: getUnixTime(new Date()),
          read: false,
          message: random.words(10),
        };

        messages.push(message);
      } else {
        const message: MessageInterface = {
          dialogsId: dialog._id,
          senderId: dialog.members[1],
          recipient: dialog.members[0],
          createdAt: getUnixTime(new Date()),
          updatedAt: getUnixTime(new Date()),
          read: false,
          message: random.words(30),
        };

        messages.push(message);
      }
    }
  });

  messages.forEach(async message => {
    console.log(message);
    const messageModel = new Message(message);
    await messageModel.save((err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log(logs.info('Successfully save message'));
      }
    });
  });
})();

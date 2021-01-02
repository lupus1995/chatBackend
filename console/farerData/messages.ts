import { MessageInterface } from '../schema/message';
import Dialogs, { DialogsInterface } from '../schema/dialogs';
import Message from '../schema/message';
import { getUnixTime } from 'date-fns';
import { random } from 'faker';
import logs from '../helpers/colors';

(async () => {
  const dialogsData = await Dialogs.find({}, (err, dialogs) => {
    if (err) {
      console.log(err);
    }

    return dialogs;
  });

  const messages: MessageInterface[] = [];

  const newDialogData = dialogsData.map((dialog: DialogsInterface) => {
    const messagesForDialogs: MessageInterface[] = [];
    for (let i = 0; i < 100; i++) {
      let message: MessageInterface;
      if (i % 2 === 0) {
        message = new Message({
          dialogsId: dialog._id,
          senderId: dialog.members[0],
          recipientId: dialog.members[1],
          createdAt: getUnixTime(new Date()),
          updatedAt: getUnixTime(new Date()),
          read: false,
          message: random.words(10),
        });
      } else {
        message = new Message({
          dialogsId: dialog._id,
          senderId: dialog.members[1],
          recipientId: dialog.members[0],
          createdAt: getUnixTime(new Date()),
          updatedAt: getUnixTime(new Date()),
          read: false,
          message: random.words(30),
        });
      }
      messagesForDialogs.push(message);
      messages.push(message);
    }

    dialog.messages = messagesForDialogs;
    return dialog;
  });

  newDialogData.forEach(async item => {
    await item.save();
  });

  await Message.insertMany(messages, (error, message) => {
    if (error) {
      console.log(error);
    } else {
      console.log(logs.info('Messages saved successfully'));
    }
  });
})();

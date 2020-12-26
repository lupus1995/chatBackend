import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';
import { Message } from 'src/helpers/schemas/message.schema';
import { User } from 'src/helpers/schemas/user.schema';
import { GetAllDialogsInterface } from './dialogs.interface';
import { CreateDialogDto, UpdateDialogDto } from './create-dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectModel(Dialogs.name) private dialogsModel: Model<Dialogs>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findAll({
    userId,
  }: {
    userId: string;
  }): Promise<GetAllDialogsInterface[]> {
    const dialogs = await this.dialogsModel.find({ members: userId });
    const membersIds = dialogs.map(dialog => {
      const member = dialog.members.filter(member => member !== userId)[0];
      return member;
    });

    const members = await this.userModel.find({ _id: membersIds });
    // console.log(members);

    const dialogsIds = dialogs.map(dialog => dialog._id);
    const lastMessagesIds: Message[] = [];

    // TODO переделать на нормальный запрос в будущем
    for (let i = 0; i < dialogsIds.length; i++) {
      const dialogId = dialogsIds[i];
      const message = await this.messageModel.findOne(
        { dialogsId: dialogId },
        { sort: { createdAt: -1 } },
      );

      lastMessagesIds.push(message._id);
    }

    const messages = await this.messageModel.find({ _id: lastMessagesIds });

    const data = dialogs.map(dialog => {
      const memberId = dialog.members.find(item => item !== userId);
      const member = members.find(memberItem => memberItem._id == memberId);
      const message = messages.find(messageItem => {
        return messageItem.dialogsId == dialog._id;
      });

      return {
        company: {
          fullname: `${member.name} ${member.surname}`,
          _id: member._id,
        },
        message: message.message,
        date: message.createdAt,
        senderId: message.senderId,
        recipientId: message.recipient,
      };
    });

    return data;
  }

  async createDialog({ type, members }: CreateDialogDto): Promise<Dialogs> {
    const dialog = new this.dialogsModel({ type, members });
    const result = await dialog.save();
    return result;
  }

  async updateDialog({
    type,
    members,
    _id,
  }: UpdateDialogDto): Promise<Dialogs> {
    const dialog = await this.dialogsModel.findByIdAndUpdate(_id, {
      type,
      members,
    });

    return dialog;
  }

  async deleteDialog({ dialogId }: { dialogId: string }) {
    const result = await this.dialogsModel.findByIdAndDelete(dialogId);
    console.log(result);
    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';
import { Message } from 'src/helpers/schemas/message.schema';
import { User } from 'src/helpers/schemas/user.schema';
import { GetAllDialogsInterface } from './dialogs.interface';
import { CreateDialogDto } from './create-dialog.dto';

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
    const user = await this.userModel.findById(userId);
    const dialogs = await this.dialogsModel
      .find({ members: { $in: [user] } })
      .populate({
        path: 'members',
        model: User,
      })
      .populate({
        path: 'messages',
        model: Message,
      });

    console.log(dialogs[0]);

    return dialogs.map(item => {
      const member =
        item.members.find(memberItem => memberItem._id !== user._id) || user;
      const messageModel = item.messages[item.messages.length - 1];
      return {
        company: {
          fullname: `${member.name} ${member.surname}`,
          _id: member._id,
        },
        message: messageModel.message,
        date: messageModel.createdAt,
        senderId: messageModel.senderId,
        recipientId: messageModel.recipient,
      };
    });
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
  }: CreateDialogDto & { _id: string }): Promise<Dialogs> {
    const dialog = await this.dialogsModel.findByIdAndUpdate(_id, {
      type,
      // members,
    });

    return dialog;
  }

  async deleteDialog({ dialogId }: { dialogId: string }) {
    const result = await this.dialogsModel.findByIdAndDelete(dialogId);
    console.log(result);
    return result;
  }
}

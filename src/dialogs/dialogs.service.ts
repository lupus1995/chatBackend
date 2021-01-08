import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';
import { Message } from 'src/helpers/schemas/message.schema';
import { User } from 'src/helpers/schemas/user.schema';
import { GetAllDialogsInterface } from './dialogs.interface';
import { CreateDialogDto } from './create-dialog.dto';
import { sortBy } from 'lodash';

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

    const emptyDialog = sortBy(
      dialogs.filter(item => item.messages.length === 0),
      item => item.createdAt,
      'asc',
    ).reverse();
    const dialogWithMessage = dialogs.filter(item => item.messages.length > 0);

    return [...emptyDialog, ...dialogWithMessage].map(item => {
      const member = item.members.find(
        memberItem => String(memberItem._id) !== String(user._id),
      );
      const messageModel: Message | undefined =
        item.messages[item.messages.length - 1];

      return {
        company: {
          fullname: `${member.name} ${member.surname}`,
          dialogId: item._id,
          dialogCreatedDate: item.createdAt,
          typeDialog: item.type,
          memberId: member._id,
        },
        message: messageModel?.message,
        date: messageModel?.createdAt,
        senderId: messageModel?.senderId,
        recipientId: messageModel?.recipientId,
      };
    });
  }

  async createDialog({
    type,
    members,
  }: CreateDialogDto): Promise<GetAllDialogsInterface> {
    // id тестируемого юзера 5fe251b307941833081e7f16
    const dialog = new this.dialogsModel({
      type,
      members,
      messages: [],
    });
    try {
      await dialog.save();
    } catch (e) {
      console.log(e);
    }

    const memberId = members.find(item => item !== '5fe251b307941833081e7f16');
    const member = await this.userModel.findById(memberId);

    return {
      company: {
        fullname: `${member.name} ${member.surname}`,
        dialogId: dialog._id,
        dialogCreatedDate: dialog.createdAt,
        typeDialog: dialog.type,
        memberId: member._id,
      },
    };
  }

  async updateDialog({
    type,
    members,
    _id,
  }: CreateDialogDto & { _id: string }) {
    const membersModel = await this.userModel
      .find({ _id: { $in: members } })
      .exec();

    const dialog = await this.dialogsModel
      .findByIdAndUpdate(_id, {
        type,
        members: membersModel,
      })
      .populate({
        path: 'messages',
        model: Message,
      });

    const messageModel: Message | undefined =
      dialog.messages[dialog.messages.length - 1];

    const memberId = members.find(item => item !== '5fe251b307941833081e7f16');
    const member = await this.userModel.findById(memberId);

    return {
      company: {
        fullname: `${member.name} ${member.surname}`,
        dialogId: dialog._id,
        dialogCreatedDate: dialog.createdAt,
        typeDialog: dialog.type,
        memberId: member._id,
      },
      message: messageModel?.message,
      date: messageModel?.createdAt,
      senderId: messageModel?.senderId,
      recipientId: messageModel?.recipientId,
    };
  }

  async deleteDialog({ dialogId }: { dialogId: string }) {
    const result = await this.dialogsModel.findByIdAndDelete(dialogId);
    return result;
  }

  async getMembersForCreateDialog({
    userId,
  }: {
    userId: string;
  }): Promise<User[]> {
    const user = await this.userModel.findById(userId);
    const dialogs = await this.dialogsModel
      .find({ members: { $in: [user] } })
      .populate({
        path: 'members',
        model: User,
      });

    const membersIds = dialogs.map(item => {
      const member = item.members.find(
        memberItem => String(memberItem._id) !== String(user._id),
      );

      return member._id;
    });

    const usersForDialog: User[] = await this.userModel.find({
      _id: { $nin: [...membersIds, user._id] },
    });

    return usersForDialog;
  }
}

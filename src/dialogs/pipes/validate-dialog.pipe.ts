import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';
import { User } from 'src/helpers/schemas/user.schema';
import { CreateDialogDto } from '../create-dialog.dto';

@Injectable()
export class ValidateDialogPipe implements PipeTransform {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Dialogs.name) private dialogsModel: Model<Dialogs>,
  ) {}

  async transform({ type, members }: CreateDialogDto) {
    if (
      this.checkLengthMember({ members }) ||
      this.getCheckIdsMember({ members })
    ) {
      return;
    }

    const users = await this.checkUsersInBD({ members });

    if (users && typeof users === 'object') {
      await this.checkDialogInDB({ users });
    } else {
      return;
    }

    return { type, members };
  }

  private async checkDialogInDB({ users }: { users: User[] }) {
    const dialog = await this.dialogsModel.findOne({
      members: users as User[],
    });

    if (dialog) {
      throw new BadRequestException(
        `Диалог с пользователями ${(users as User[])
          .map(item => `${item.name} ${item.surname}`)
          .join(', ')} ранее был создан`,
      );

      return;
    }
  }

  private async checkUsersInBD({
    members,
  }: {
    members: string[];
  }): Promise<boolean | User[]> {
    let users: User[] = [];
    try {
      users = await this.userModel.find({ _id: { $in: members } });
      return users;
    } catch (e) {
      throw new BadRequestException(
        `Одного из пользователей нет в базе данных`,
      );
      return;
    }

    return false;
  }

  private checkLengthMember({ members }: { members: string[] }) {
    if (members.length < 2) {
      throw new BadRequestException(
        `Для создания диалога необходимо указать минимум двух участников`,
      );
      return;
    }

    return false;
  }

  private getCheckIdsMember({ members }: { members: string[] }) {
    const checkMembers = this.checkIdsMembers({ members });
    if (checkMembers.length > 0) {
      throw new BadRequestException(
        `Id пользователей ${checkMembers.join(', ')} указаны не корректно`,
      );
      return;
    }

    return false;
  }

  private checkIdsMembers({ members }: { members: string[] }) {
    return members.filter(item => {
      return !isValidObjectId(item);
    });
  }
}

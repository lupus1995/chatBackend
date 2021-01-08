import { MessageSchema, Message } from '../helpers/schemas/message.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dialogs, DialogsSchema } from 'src/helpers/schemas/dialogs.schema';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { User, UserSchema } from 'src/helpers/schemas/user.schema';
import { TypesController } from './types.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dialogs.name, schema: DialogsSchema },
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [DialogsController, TypesController],
  providers: [DialogsService, UsersService],
})
export class DialogsModule {}

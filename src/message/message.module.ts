import { DialogsSchema } from './../../console/schema/dialogs';
import { MessageSchema } from './../helpers/schemas/message.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from 'src/helpers/schemas/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Dialogs } from 'src/helpers/schemas/dialogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      {
        name: Dialogs.name,
        schema: DialogsSchema,
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}

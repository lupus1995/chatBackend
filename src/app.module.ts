import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/chatdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UsersModule,
    AuthModule,
    DialogsModule,
    MessageModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {}

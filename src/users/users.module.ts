import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../helpers/schemas/user.schema';
import { UsersService } from './users.service';
import { UniqueUserEmailValidatorConstruct } from '../helpers/validators/unique-user-email.validator';
import { UniqueUserLoginValidatorConstruct } from '../helpers/validators/unique-user-login.validator';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UniqueUserEmailValidatorConstruct,
    UniqueUserLoginValidatorConstruct,
  ],
  exports: [UsersService],
})
export class UsersModule {}

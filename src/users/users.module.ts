import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/helpers/schemas/user.schema';
import { UsersService } from './users.service';
import { UniqueUserEmailValidatorConstruct } from 'src/helpers/validators/unique-user-email.validator';
import { UniqueUserLoginValidatorConstruct } from 'src/helpers/validators/unique-user-login.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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

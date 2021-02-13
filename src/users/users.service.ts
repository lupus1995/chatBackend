import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/createUserDto';
import { User } from '../helpers/schemas/user.schema';
import sendEmail from '../helpers/resourse/sendEmail';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // created user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.password = await hash(createdUser.password, 10);

    await createdUser.save();

    // await sendEmail({ email: createUserDto.email, id: createdUser._id });

    return createdUser;
  }

  async findAllUsers({ usersIds }: { usersIds?: string[] }): Promise<User[]> {
    if (usersIds.length === 0) {
      return await this.userModel.find().exec();
    }

    return await this.userModel.find({ _id: { $in: usersIds } }).exec();
  }

  async findOneUser({ id }: { id: string }): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findUserByEmail({ email }: { email: string }): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findUserByLogin({ login }: { login: string }): Promise<User | null> {
    return await this.userModel.findOne({ login });
  }

  async findByIdAndUpdateUser({
    id,
    createUserDto,
  }: {
    id: string;
    createUserDto: CreateUserDto;
  }) {
    return this.userModel.findByIdAndUpdate(id, createUserDto);
  }

  async deleteUser({ id }: { id: string }) {
    return this.userModel.findByIdAndDelete(id);
  }

  async verifyEmail({ id }: { id: string }): Promise<boolean> {
    console.log(isValidObjectId(id));
    const user = await this.findOneUser({ id });
    console.log(user);
    if (user) {
      await this.userModel.findByIdAndUpdate(id, {
        verifyEmail: true,
      });

      return true;
    }
    return false;
  }
}

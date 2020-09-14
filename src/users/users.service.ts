import { CreateUserDto } from './dto/createUserDto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // created user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    console.log(createdUser);
    return createdUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneUser({ id }: { id: string }): Promise<User> {
    return this.userModel.findById(id);
  }

  async findUserByName({ name }: { name: string }): Promise<User> {
    return this.userModel.findOne({ name });
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
}

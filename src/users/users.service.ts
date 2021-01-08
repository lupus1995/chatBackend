import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/createUserDto';
import { User } from 'src/helpers/schemas/user.schema';
import { ValidationError } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // created user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const validate = await new CreateUserDto(createUserDto).validate();
    console.log(validate);
    if (validate.length === 0) {
      const createdUser = new this.userModel(createUserDto);
      createdUser.password = await hash(createdUser.password, 10);
      return createdUser.save();
    }

    throw {
      message: this.getErrorMessage(validate),
    };
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

  async findUserByName({ name }: { name: string }): Promise<User> {
    return this.userModel.findOne({ name });
  }

  async findUserByEmail({ email }: { email: string }): Promise<User | null> {
    return this.userModel.findOne({ email });
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

  private getErrorMessage(validate: ValidationError[]) {
    return validate.map(item => ({
      field: item.property,
      message: Object.values(item.constraints),
    }));
  }
}

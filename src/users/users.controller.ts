import { ErrorsInterface } from '../helpers/interfaces/errors.interface';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/helpers/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserFilter } from './create-user.filter';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // GET получить всех юзеров
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  // GET :id - получить конкретного пользователя
  @Get(':id')
  async findOne(@Param('id') id: { id: string }): Promise<User> {
    return await this.usersService.findOneUser(id);
  }

  // POST создание пользователя
  @Post()
  @UseFilters(CreateUserFilter)
  async create(@Body() createUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (e) {
      const { message }: ErrorsInterface = e;
      return {
        status: 400,
        message: [message],
        error: 'Bad Request',
      };
    }
  }

  // PUT :id - обновить пользователя
  @Put(':id')
  async update(@Param('id') id, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.findByIdAndUpdateUser({ id, createUserDto });
  }

  // DELETE :id - удалить пользователя
  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.usersService.deleteUser(id);
  }
}

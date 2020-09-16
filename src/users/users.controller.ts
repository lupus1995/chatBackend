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
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
  async findOne(@Param('id') id): Promise<User> {
    return await this.usersService.findOneUser(id);
  }

  // POST создаие пользователя
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
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

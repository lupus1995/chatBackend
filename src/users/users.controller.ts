import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/helpers/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserFilter } from './create-user.filter';
import { Response } from 'express';

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
  async create(@Body() createUserDto, @Res() res: Response) {
    try {
      const result = await this.usersService.createUser(createUserDto);
      console.log(result);
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      const { message }: any = e;
      console.log(message);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: message,
        error: 'Bad Request',
      });
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

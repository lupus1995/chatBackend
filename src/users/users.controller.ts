import { ExistUserPipe } from './../helpers/pipes/exist-user.pipe';
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
  UsePipes,
} from '@nestjs/common';
import { User } from '../helpers/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // GET получить всех юзеров
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    description: 'Получение информации о пользователях',
    status: 200,
  })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAllUsers({ usersIds: [] });
  }

  // получить конкретного пользователя
  @Get(':id')
  @ApiResponse({
    description: 'Получение информации о пользователe',
    status: 200,
  })
  async findOne(@Param('id') id: { id: string }): Promise<User> {
    return await this.usersService.findOneUser(id);
  }

  // создание пользователя
  @Post()
  @ApiResponse({
    description: 'Создание пользователя',
    status: 201,
  })
  @ApiResponse({
    description: 'Ошибка в данных запроса',
    status: 400,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  // верификация email
  @Get('verify/:id')
  @UsePipes(ExistUserPipe)
  @ApiResponse({
    description: 'Подтвеждение пользователя email',
    status: 200,
  })
  @ApiResponse({
    description: 'Ошибка в данных запроса',
    status: 400,
  })
  @ApiResponse({
    description: 'Пользователя нет в базе данных',
    status: 404,
  })
  async verifyEmail(@Param('id') id: string): Promise<User> {
    return await this.usersService.verifyEmail({ id });
  }

  // обновить пользователя
  @Put(':id')
  @ApiResponse({
    description: 'Обновление пользователя',
    status: 200,
  })
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.findByIdAndUpdateUser({ id, createUserDto });
  }

  // удалить пользователя
  @Delete(':id')
  @ApiResponse({
    description: 'Удаление пользователя',
    status: 200,
  })
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteUser({ id });
  }
}

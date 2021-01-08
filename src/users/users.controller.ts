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
    status: 200,
  })
  @UseFilters(CreateUserFilter)
  async create(@Body() createUserDto, @Res() res: Response) {
    try {
      const result = await this.usersService.createUser(createUserDto);
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

  // обновить пользователя
  @Put(':id')
  @ApiResponse({
    description: 'Обновление пользователя',
    status: 200,
  })
  async update(@Param('id') id, @Body() createUserDto: CreateUserDto) {
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

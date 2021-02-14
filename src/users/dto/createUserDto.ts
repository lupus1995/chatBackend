import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { UniqueUserEmailValidator } from '../../helpers/validators/unique-user-email.validator';
import { UniqueUserLoginValidator } from '../../helpers/validators/unique-user-login.validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsEmail()
  @UniqueUserEmailValidator({
    message: 'This email address is already in use',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @Length(8, 12)
  password: string;

  @IsNotEmpty()
  @UniqueUserLoginValidator({
    message: 'This login is already in use',
  })
  login: string;
}

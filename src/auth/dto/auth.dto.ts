import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Email пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @Length(8, 12)
  password: string;
}

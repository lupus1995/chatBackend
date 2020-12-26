import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, validate } from 'class-validator';
import { UniqueUserEmailValidator } from 'src/helpers/validators/unique-user-email.validator';

interface CreateUserInterface {
  email: string;
  name: string;
  password: string;
}

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

  constructor(createUserInterface: CreateUserInterface) {
    this.email = createUserInterface.email;
    this.name = createUserInterface.name;
    this.password = createUserInterface.password;
    return this;
  }

  async validate() {
    return validate(this);
  }
}

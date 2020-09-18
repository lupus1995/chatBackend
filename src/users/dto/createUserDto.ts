import { IsEmail, IsNotEmpty, Length, validate } from 'class-validator';
import { UniqueUserEmailValidator } from 'src/helpers/validators/unique-user-email.validator';

interface CreateUserInterface {
  email: string;
  name: string;
  password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @UniqueUserEmailValidator({
    message: 'This email address is already in use',
  })
  email: string;

  @IsNotEmpty()
  name: string;

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

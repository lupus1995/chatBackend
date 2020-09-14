import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser({
    password,
    name,
  }: {
    password: string;
    name: string;
  }): Promise<any> {
    const user = await this.usersService.findUserByName({ name });

    console.log(user, 7890);

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    console.log(user);
  }
}

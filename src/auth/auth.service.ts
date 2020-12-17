import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';

import { User } from 'src/helpers/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    console.log('user', user);

    if (user && (await compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string) {
    await this.jwtService.verify(token);
  }
}

import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    console.log(name, password);
    const user = await this.userModel.findOne({ name });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

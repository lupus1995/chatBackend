import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';

import { User } from 'src/helpers/schemas/user.schema';
import VerifyTokenInterface from 'src/helpers/interfaces/verify-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async updateTokens({
    user,
  }: {
    user: User;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.getAccessToken(user);
    const refreshToken = this.getRefreshToken(user);
    await this.setRefreshToken({ refreshToken, _id: user._id });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (user && (await compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async validateUserByIdAndRefreshToken({
    id,
    refreshToken,
  }: {
    id: string;
    refreshToken: string;
  }): Promise<User> {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (user && (await compare(refreshToken, user.hashedRefreshToken))) {
      return user;
    }
  }

  getAccessToken(user: User): string {
    const payload = { username: user.name, sub: user._id };
    return this.jwtService.sign(payload);
  }

  getRefreshToken(user: User): string {
    const payload = { username: user.name, sub: user._id };
    return this.jwtService.sign(payload, { expiresIn: 2628000 });
  }

  getUserDataFromToken({ token }: { token: string }): VerifyTokenInterface {
    return this.jwtService.verify(token);
  }

  async setRefreshToken({
    refreshToken,
    _id,
  }: {
    refreshToken: string;
    _id: string;
  }): Promise<void> {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(_id, {
      hashedRefreshToken,
    });
  }
}

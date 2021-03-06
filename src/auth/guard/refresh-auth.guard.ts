import { AuthService } from './../auth.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import parseBearerToken from 'parse-bearer-token';

import VerifyTokenInterface from '../../helpers/interfaces/verify-token.interface';
import { User } from '../../helpers/schemas/user.schema';

@Injectable()
export default class RefreshAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = parseBearerToken(request);
    if (token) {
      try {
        const userDataFromToken: VerifyTokenInterface = this.authService.getUserDataFromToken(
          { token },
        );
        const user: User | null = await this.authService.validateUserByIdAndRefreshToken(
          {
            refreshToken: token,
            id: userDataFromToken.sub,
          },
        );
        if (user) {
          request.user = user;
          return true;
        }
        throw new UnauthorizedException();
      } catch (e) {
        throw new UnauthorizedException();
      }
    }
    throw new UnauthorizedException();
  }
}

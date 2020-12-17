import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }
    await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    const [bearer, token] = auth.split(' ');
    if (bearer !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    try {
      return await this.authService.verifyToken(token);
    } catch (e) {
      const message = `Token error: ${e.message || e.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}

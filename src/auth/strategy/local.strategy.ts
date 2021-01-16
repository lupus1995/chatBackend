import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(request: Request, email: string, password: string) {
    console.log('payload local', 3333);
    const contextId = ContextIdFactory.getByRequest(request);
    const authService: AuthService = await this.moduleRef.resolve(
      AuthService,
      contextId,
    );

    const user = await authService.validateUserByEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

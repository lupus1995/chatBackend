import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({
    description: 'Авторизация пользователя',
    status: 200,
  })
  async login(@Request() req) {
    const accessToken = await this.authService.getAccessToken(req.user);
    const refreshToken = await this.authService.getRefreshToken(req.user);
    return {
      accessToken,
      refreshToken,
    };
  }
}

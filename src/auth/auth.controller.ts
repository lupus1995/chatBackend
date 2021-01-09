import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

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
  async login(@Body() authDto: AuthDto, @Request() req: any) {
    const accessToken = this.authService.getAccessToken(req.user);
    const refreshToken = this.authService.getRefreshToken(req.user);
    return {
      accessToken,
      refreshToken,
    };
  }
}

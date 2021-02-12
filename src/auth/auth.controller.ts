import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import RefreshAuthGuard from './guard/refresh-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({
    description: 'Авторизация пользователя',
    status: 200,
  })
  async login(@Body() authDto: AuthDto, @Request() req: any) {
    return await this.authService.updateTokens({ user: req.user });
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(@Request() req: any) {
    return await this.authService.updateTokens({ user: req.user });
  }
}

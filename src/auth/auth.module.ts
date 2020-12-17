import { LocalStrategy } from './local.strategy';
import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/helpers/schemas/user.schema';
import { RefreshGuard } from './refresh.guard';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshGuard],
  controllers: [AuthController],
  exports: [AuthService, RefreshGuard],
})
export class AuthModule {}

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateSync } from 'class-validator';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context, status) {
    const authDto = new AuthDto();
    authDto.email = context.args[0].body.email;
    authDto.password = context.args[0].body.password;

    const validate = validateSync(authDto);

    // console.log('validate', validate);

    if (validate.length > 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: validate.length === 1 ? validate[0] : validate,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

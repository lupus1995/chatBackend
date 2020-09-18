import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class CreateUserFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log(34567);

    response.status(status).json({
      status,
      mesage: exception.message,
      error: 'Bad Request',
    });
  }
}

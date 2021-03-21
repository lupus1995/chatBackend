import * as request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { useContainer } from 'class-validator';

import { AuthModule } from './auth.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/resourse/mockConnectionToDb';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../helpers/schemas/user.schema';
import { jwtConstants } from './constants';
import TokensInterface from './tokens.inteface';

const mockDataLogin: AuthDto = {
  email: 'admin@mail.ru',
  password: '1234567890',
};

const createdUser = {
  name: 'alex',
  login: 'alex',
  ...mockDataLogin,
};

const mockDataIfResponseOnlyEmail = {
  statusCode: 400,
  message: {
    target: {
      email: mockDataLogin.email,
    },
    property: 'password',
    children: [],
    constraints: {
      length: 'password must be longer than or equal to 8 characters',
      isNotEmpty: 'password should not be empty',
    },
  },
  error: 'Bad Request',
};

const incorectEmail = {
  statusCode: 400,
  message: [
    {
      target: {
        email: 'dffghdfgh',
      },
      value: 'dffghdfgh',
      property: 'email',
      children: [],
      constraints: {
        isEmail: 'email must be an email',
      },
    },
    {
      target: {
        email: 'dffghdfgh',
      },
      property: 'password',
      children: [],
      constraints: {
        length: 'password must be longer than or equal to 8 characters',
        isNotEmpty: 'password should not be empty',
      },
    },
  ],
  error: 'Bad Request',
};

const incorectPassword = {
  statusCode: 400,
  message: [
    {
      target: {
        password: '111',
      },
      property: 'email',
      children: [],
      constraints: {
        isEmail: 'email must be an email',
        isNotEmpty: 'email should not be empty',
      },
    },
    {
      target: {
        password: '111',
      },
      value: '111',
      property: 'password',
      children: [],
      constraints: {
        length: 'password must be longer than or equal to 8 characters',
      },
    },
  ],
  error: 'Bad Request',
};

const emptyRequest = {
  statusCode: 400,
  message: [
    {
      target: {},
      property: 'email',
      children: [],
      constraints: {
        isEmail: 'email must be an email',
        isNotEmpty: 'email should not be empty',
      },
    },
    {
      target: {},
      property: 'password',
      children: [],
      constraints: {
        length: 'password must be longer than or equal to 8 characters',
        isNotEmpty: 'password should not be empty',
      },
    },
  ],
  error: 'Bad Request',
};

const mockDataIfResponseOnlyPassword = {
  statusCode: 400,
  message: {
    target: {
      password: mockDataLogin.password,
    },
    property: 'email',
    children: [],
    constraints: {
      isEmail: 'email must be an email',
      isNotEmpty: 'email should not be empty',
    },
  },
  error: 'Bad Request',
};

const unauthorized = { statusCode: 401, message: 'Unauthorized' };

describe('check auth controller', () => {
  let app: INestApplication;
  let userService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
        }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '1800s' },
        }),
        AuthModule,
        UsersModule,
      ],
      providers: [AuthService, UsersService],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: errors => new BadRequestException(errors),
      }),
    );
    useContainer(app.select(AuthModule), { fallbackOnErrors: true });
    await app.init();

    userService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('check login', () => {
    it('/auth/login, success login', async () => {
      await userService.createUser(createdUser);
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(mockDataLogin)
        .expect(({ body }: { body: TokensInterface }) => {
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        })
        .expect(HttpStatus.CREATED);
    });

    it('/auth/login, failed login', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(mockDataLogin)
        .expect(({ body }) => {
          expect(body).toEqual(unauthorized);
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('/auth/login, only email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ email: mockDataLogin.email })
        .expect(({ body }) => {
          expect(body).toEqual(mockDataIfResponseOnlyEmail);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/auth/login, incorect email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'dffghdfgh' })
        .expect(({ body }) => {
          expect(body).toEqual(incorectEmail);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/auth/login, only password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ password: mockDataLogin.password })
        .expect(({ body }) => {
          expect(body).toEqual(mockDataIfResponseOnlyPassword);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/auth/login, incorect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ password: '111' })
        .expect(({ body }) => {
          expect(body).toEqual(incorectPassword);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/auth/login, empty request', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .expect(({ body }) => {
          expect(body).toEqual(emptyRequest);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('check refresh token', () => {
    it('/auth/refresh, check refresh token success', async () => {
      const user = await userService.createUser(createdUser);
      const tokens: TokensInterface = await authService.updateTokens({ user });

      return request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .expect(({ body }: { body: TokensInterface }) => {
          // console.log(body);
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    it('/auth/refresh, check refresh bad token', async () => {
      return request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ghjfgghjfgghjfhjfhfhjfhjfhgjfghj')
        .expect(({ body }) => {
          expect(body).toEqual(unauthorized);
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('/auth/refresh, check refresh token without headers', () => {
      return request(app.getHttpServer())
        .get('/auth/refresh')
        .expect(({ body }) => {
          expect(body).toEqual(unauthorized);
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('check user', () => {
    it('/auth/user, check user by token, success', async () => {
      const user = await userService.createUser(createdUser);
      const tokens: TokensInterface = await authService.updateTokens({ user });
      return request(app.getHttpServer())
        .get('/auth/user')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(({ body }) => {
          expect(body).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });
});

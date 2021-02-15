import * as request from 'supertest';
import { UsersModule } from './users.module';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/resourse/mockConnectionToDb';
import { User } from 'src/helpers/schemas/user.schema';
import { useContainer } from 'class-validator';
import {
  createUserData,
  badRequestByEmptyEmail,
  badRequestByIncorectEmail,
  createUserDataByNewLogin,
  badRequestByExistEmail,
  createUserDataByNewEmailAndOldLogin,
  badRequestByExistLogin,
  badRequestIncorectUser,
  badRequestDontExistUser,
} from './users.filings';
import { ConfigModule } from '@nestjs/config';

describe('Users', () => {
  let app: INestApplication;
  let user: User;
  const incorectUserId = 'asdasdasdasd';
  const idDontExistUser = '602910af5ec08544fc95c93d';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
        }),
        rootMongooseTestModule(),
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: errors => new BadRequestException(errors),
      }),
    );
    useContainer(app.select(UsersModule), { fallbackOnErrors: true });
    await app.init();
  });

  describe('testing create user', () => {
    it('/users POST empty email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...createUserData, email: '' })
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestByEmptyEmail);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/users POST incorect email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({ ...createUserData, email: '12312312' })
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestByIncorectEmail);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/users POST success', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send(createUserData)
        .expect(({ body }: { body: User }) => {
          user = body;
          expect(body._id).toBeDefined();
          expect(body.name).toEqual(createUserData.name);
          expect(body.login).toEqual(createUserData.login);
          expect(body.email).toEqual(createUserData.email);
          expect(body.verifyEmail).toEqual(false);
        })
        .expect(HttpStatus.CREATED);
    });

    it('/users POST exist email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send(createUserDataByNewLogin)
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestByExistEmail);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/users POST exist login', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send(createUserDataByNewEmailAndOldLogin)
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestByExistLogin);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('testing verify email', () => {
    it('/users/verify/:id GET incorrect user', () => {
      return request(app.getHttpServer())
        .get(`/users/verify/${incorectUserId}`)
        .send()
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestIncorectUser);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/users/verify/:id GET user does not exist', () => {
      return request(app.getHttpServer())
        .get(`/users/verify/${idDontExistUser}`)
        .send()
        .expect(({ body }: { body: any }) => {
          expect(body).toEqual(badRequestDontExistUser);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/users/verify/:id GET success', () => {
      return request(app.getHttpServer())
        .get(`/users/verify/${user._id}`)
        .send()
        .expect(({ body }: { body: User }) => {
          expect(body.verifyEmail).toBe(true);
        })
        .expect(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });
});

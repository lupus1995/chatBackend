import { UsersService } from './../users/users.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/resourse/mockConnectionToDb';
import { User, UserSchema } from '../helpers/schemas/user.schema';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import TokensInterface from './tokens.inteface';

const createdUser = {
  name: 'alex',
  login: 'alex',
  email: 'canya.panfilov.95@gmail.com',
  password: 'sancho1995',
};

describe('Auth', () => {
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        UsersModule,
      ],
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('check function updateTokens', async () => {
    const user = await userService.createUser(createdUser);
    const tokens: TokensInterface = await authService.updateTokens({ user });
    expect(tokens.accessToken).not.toBeUndefined();
    expect(tokens.refreshToken).not.toBeUndefined();
  });

  it('check function validateUserByEmailAndPassword, user will be searched', async () => {
    const user = await userService.createUser(createdUser);
    const searchUser: User | null = await authService.validateUserByEmailAndPassword(
      'canya.panfilov.95@gmail.com',
      'sancho1995',
    );
    expect(searchUser.email).toEqual(user.email);
    expect(searchUser.password).toEqual(user.password);
  });

  it('check function validateUserByEmailAndPassword, user will not be searched', async () => {
    const searchUser: User | null = await authService.validateUserByEmailAndPassword(
      'canya.panfilov.95@gmail.com',
      'sancho1995',
    );

    expect(searchUser).toBeNull();
  });

  it('check function validateUserByIdAndRefreshToken, validated user', async () => {
    const user: User = await userService.createUser(createdUser);
    const tokens: TokensInterface = await authService.updateTokens({ user });
    const validatedUser = await authService.validateUserByIdAndRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    expect(validatedUser).not.toBeNull();
  });

  it('check function validateUserByIdAndRefreshToken, not validated user', async () => {
    const validatedUser = await authService.validateUserByIdAndRefreshToken({
      id: '604671298b8ebb00fc3c0aeb',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ItCQ0LvQtdC60YHQsNC90LTRgCIsInN1YiI6IjYwNDY3MTI5OGI4ZWJiMDBmYzNjMGFlYiIsImlhdCI6MTYxNjI0OTQ0MSwiZXhwIjoxNjE4ODc3NDQxfQ.KgKAYvsyhk7LslTzHHObkH9NYQyyz5GiMJHwAFYLxuo',
    });

    expect(validatedUser).toBeNull();
  });

  it('check function getAccessToken', async () => {
    const user: User = await userService.createUser(createdUser);
    const accessToken = authService.getAccessToken(user);
    expect(accessToken).toBeDefined();
  });

  it('check function getRefreshToken', async () => {
    const user: User = await userService.createUser(createdUser);
    const refreshToken = authService.getRefreshToken(user);
    expect(refreshToken).toBeDefined();
  });

  it('check function getUserDataFromToken', async () => {
    const user: User = await userService.createUser(createdUser);
    const tokens: TokensInterface = await authService.updateTokens({ user });
    const data = authService.getUserDataFromToken({
      token: tokens.accessToken,
    });

    expect(data).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});

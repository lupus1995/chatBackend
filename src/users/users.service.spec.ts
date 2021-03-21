import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/resourse/mockConnectionToDb';
import { User, UserSchema } from '../helpers/schemas/user.schema';
import { UsersService } from './users.service';

const createdUser = {
  name: 'alex',
  login: 'alex',
  email: 'canya.panfilov.95@gmail.com',
  password: 'sancho1995',
};

describe('UserService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
        }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('check function createUser', async () => {
    const user = await service.createUser(createdUser);

    expect(user.name).toBe(createdUser.name);
    expect(user.login).toBe(createdUser.login);
    expect(user.email).toBe(createdUser.email);
  }, 10000);

  it('check function verifyEmail', async () => {
    const user = await service.createUser(createdUser);
    const verifyEmail = await service.verifyEmail({ id: user.id });
    expect(verifyEmail.verifyEmail).toBe(true);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});

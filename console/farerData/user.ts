import { random, internet, name } from 'faker';
import logs from '../helpers/colors';
import { UsersInterface } from '../schema/user';
import Users from '../schema/user';

let users: UsersInterface[] = [];

for (let i = 0; i < 100; i++) {
  const userModel = new Users({
    login: random.uuid(),
    email: internet.email(),
    password: random.uuid(),
    name: name.firstName(),
    surname: name.lastName(),
    patronimic: '',
    avatar: '',
  });
  users.push(userModel);
}

users = [...new Set(users)];

Users.insertMany(users, (error, users) => {
  if (error) {
    console.log(error);
  } else {
    console.log(logs.info('Users saved successfully'));
  }
});

users.forEach(async user => {
  const usersModel = new Users(user);
  await usersModel.save((err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(logs.info('Successfully save user'));
    }
  });
});

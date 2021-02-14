export const createUserData = {
  name: 'alex',
  login: 'alex',
  password: 'sancho1995',
  email: 'canya.panfilov.95@gmail.com',
};

export const createUserDataByNewLogin = {
  name: 'alex',
  login: 'Alex',
  password: 'sancho1995',
  email: 'canya.panfilov.95@gmail.com',
};

export const createUserDataByNewEmailAndOldLogin = {
  name: 'alex',
  login: 'alex',
  password: 'sancho1995',
  email: 'canya.panfilov.96@gmail.com',
};

export const badRequestByEmptyEmail = {
  statusCode: 400,
  message: [
    {
      target: {
        name: 'alex',
        login: 'alex',
        password: 'sancho1995',
        email: '',
      },
      value: '',
      property: 'email',
      children: [],
      constraints: {
        isEmail: 'email must be an email',
        isNotEmpty: 'email should not be empty',
        UniqueUserEmailValidatorConstruct:
          'This email address is already in use',
      },
    },
  ],
  error: 'Bad Request',
};

export const badRequestByIncorectEmail = {
  statusCode: 400,
  message: [
    {
      target: {
        name: 'alex',
        login: 'alex',
        password: 'sancho1995',
        email: '12312312',
      },
      value: '12312312',
      property: 'email',
      children: [],
      constraints: { isEmail: 'email must be an email' },
    },
  ],
  error: 'Bad Request',
};

export const badRequestByExistEmail = {
  statusCode: 400,
  message: [
    {
      target: {
        name: 'alex',
        login: 'Alex',
        password: 'sancho1995',
        email: 'canya.panfilov.95@gmail.com',
      },
      value: 'canya.panfilov.95@gmail.com',
      property: 'email',
      children: [],
      constraints: {
        UniqueUserEmailValidatorConstruct:
          'This email address is already in use',
      },
    },
  ],
  error: 'Bad Request',
};

export const badRequestByExistLogin = {
  statusCode: 400,
  message: [
    {
      target: {
        name: 'alex',
        login: 'alex',
        password: 'sancho1995',
        email: 'canya.panfilov.96@gmail.com',
      },
      value: 'alex',
      property: 'login',
      children: [],
      constraints: {
        UniqueUserLoginValidatorConstruct: 'This login is already in use',
      },
    },
  ],
  error: 'Bad Request',
};

export const badRequestDontExistUser = {
  statusCode: 400,
  message: 'Не корректно указан id 602910af5ec08544fc95c93d пользователя',
  error: 'Bad Request',
};

export const badRequestIncorectUser = {
  statusCode: 400,
  message: 'Не корректно указан id asdasdasdasd пользователя',
  error: 'Bad Request',
};

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const moment = require('moment');
const bcrypt = require('bcryptjs');

const marcyDate = moment().subtract(1003, 'years').toDate();
const bonnieDate = moment().subtract(827, 'years').toDate();
const finnDate = moment().subtract(17, 'years').toDate();
const jakeDate = moment().subtract(34, 'years').toDate();

const users = [
  {
    name: 'Finn',
    lastname: 'The Human',
    email: 'finn_the_human@gmail.com',
    phoneNumber: '987900856',
    birthday: finnDate,
    gender: 'Masculino',
    passwordHash: '123fin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Jake',
    lastname: 'The Dog',
    email: 'jake_the_dog@gmail.com',
    phoneNumber: '83987900856',
    birthday: jakeDate,
    gender: 'Masculino',
    passwordHash: '123jake',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Marceline',
    lastname: 'Abadeer',
    email: 'Marceline_the_vampire_queen@gmail.com',
    phoneNumber: '(83)987900856',
    birthday: marcyDate,
    gender: 'Feminino',
    passwordHash: '123marcy',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Bonnibel',
    lastname: 'Bubblegum',
    email: 'princess_bubblegum@gmail.com',
    phoneNumber: '+55(83)987900856',
    birthday: bonnieDate,
    gender: 'Feminino',
    passwordHash: '123bonnie',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const user of users) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 5);

      const existedUser = await queryInterface.rawSelect(
        'Users',
        {
          where: {
            email: user.email,
          },
        },
        ['id'],
      );

      if (!existedUser || existedUser.length === 0) await queryInterface.bulkInsert('Users', [user], {});
      else console.log(`usuario com o email '${user.email}' já existe`);
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', users, {}),
};

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const moment = require('moment');
const bcrypt = require('bcryptjs');

const marcyData = moment().subtract(1003, 'years').toDate();
const bonnieData = moment().subtract(827, 'years').toDate();
const finnData = moment().subtract(17, 'years').toDate();
const jakeData = moment().subtract(34, 'years').toDate();

const usuarios = [
  {
    nome: 'Finn',
    sobrenome: 'The Human',
    email: 'finn_the_human@gmail.com',
    dataDeNascimento: finnData,
    genero: 'Masculino',
    senhaHash: '123fin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Jake',
    sobrenome: 'The Dog',
    email: 'jake_the_dog@gmail.com',
    dataDeNascimento: jakeData,
    genero: 'Masculino',
    senhaHash: '123jake',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Marceline',
    sobrenome: 'Abadeer',
    email: 'Marceline_the_vampire_queen@gmail.com',
    dataDeNascimento: marcyData,
    genero: 'Feminino',
    senhaHash: '123marcy',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Bonnibel',
    sobrenome: 'Bubblegum',
    email: 'princess_bubblegum@gmail.com',
    dataDeNascimento: bonnieData,
    genero: 'Feminino',
    senhaHash: '123bonnie',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const usuario of usuarios) {
      usuario.senhaHash = await bcrypt.hash(usuario.senhaHash, 5);

      const usuarioExistente = await queryInterface.rawSelect(
        'Usuarios',
        {
          where: {
            email: usuario.email,
          },
        },
        ['id'],
      );

      if (!usuarioExistente || usuarioExistente.length === 0) await queryInterface.bulkInsert('Usuarios', [usuario], {});
      else console.log(`usuario com o email '${usuario.email}' já existe`);
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('usuarios', usuarios, {}),
};

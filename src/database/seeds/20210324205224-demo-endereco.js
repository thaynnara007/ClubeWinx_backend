/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const enderecos = [
  {
    usuarioId: 1,
    rua: 'Tree house',
    numero: 123,
    bairro: 'Candy Kingdom',
    complemento: 'uma grande arvore',
    cep: '12345-563',
    cidade: 'Candy Kingdom',
    estado: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    usuarioId: 2,
    rua: 'Tree house',
    numero: 123,
    bairro: 'Candy Kingdom',
    complemento: 'uma grande arvore',
    cep: '12345-563',
    cidade: 'Candy Kingdom',
    estado: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    usuarioId: 3,
    rua: "Marcy's cave",
    numero: 124,
    complemento: 'Um caverna com uma casa dentro',
    cep: '12344-563',
    estado: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    usuarioId: 4,
    rua: 'Candy Castle',
    numero: 113,
    bairro: 'Candy Kingdom',
    complemento: 'O castelo da princesa',
    cep: '22345-563',
    cidade: 'Candy Kingdom',
    estado: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const endereco of enderecos) {
      const usuarioExistente = await queryInterface.rawSelect(
        'Enderecos',
        {
          where: {
            usuarioId: endereco.usuarioId,
          },
        },
        ['id'],
      );

      if (!usuarioExistente || usuarioExistente.length === 0) await queryInterface.bulkInsert('Enderecos', [endereco], {});
      else {
        console.log(
          `O usuário de id ${endereco.usuarioId} ja cadastrou um endereço`,
        );
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('enderecos', enderecos, {}),
};

/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const addresses = [
  {
    userId: 1,
    street: 'Tree house',
    number: 123,
    district: 'Candy Kingdom',
    complement: 'uma grande arvore',
    zipCode: '12345-563',
    city: 'Candy Kingdom',
    state: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 2,
    street: 'Tree house',
    number: 123,
    district: 'Candy Kingdom',
    complement: 'uma grande arvore',
    zipCode: '12345-563',
    city: 'Candy Kingdom',
    state: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    street: "Marcy's cave",
    number: 124,
    complement: 'Um caverna com uma casa dentro',
    zipCode: '12344-563',
    state: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 4,
    street: 'Candy Castle',
    number: 113,
    district: 'Candy Kingdom',
    complement: 'O castelo da princesa',
    zipCode: '22345-563',
    city: 'Candy Kingdom',
    state: 'Land of Ooo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const address of addresses) {
      const existedUser = await queryInterface.rawSelect(
        'Addresses',
        {
          where: {
            userId: address.userId,
          },
        },
        ['id'],
      );

      if (!existedUser || existedUser.length === 0) await queryInterface.bulkInsert('Addresses', [address], {});
      else {
        console.log(
          `O usuário de id ${address.userId} ja cadastrou um endereço`,
        );
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Addresses', addresses, {}),
};

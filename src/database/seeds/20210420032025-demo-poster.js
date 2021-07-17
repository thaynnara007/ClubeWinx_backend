/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const posters = [
  {
    userId: 1,
    expense: 286.89,
    description:
      'Its a tree house, with 3 floors, a video game, a dog, the taz came from our tresure, that i and jake picks up, so you may have no worries',
    residents: 3,
    vacancies: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    expense: 246.89,
    description:
      'Its a cave shaped like home. There are some bats at it, but hey, you would have you personal piece of the ocean',
    residents: 1,
    vacancies: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const poster of posters) {
      const existedPoster = await queryInterface.rawSelect(
        'Posters',
        {
          where: {
            userId: poster.userId,
          },
        },
        ['id'],
      );

      if (!existedPoster || existedPoster.length === 0) await queryInterface.bulkInsert('Posters', [poster], {});
      else {
        console.log(`O usuário de id ${poster.userId} ja tem um anúncio`);
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Posters', posters, {}),
};

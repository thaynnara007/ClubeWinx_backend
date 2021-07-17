/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const pictures = [
  {
    profileId: 1,
    imageName: 'finn.jpeg',
    token: 'ebcc14fb-287d-4d06-949e-9889c063fba4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 2,
    imageName: 'jake.png',
    token: '73750e8e-0770-40f5-b2c5-4883faf64647',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 3,
    imageName: 'marcy.png_1619209381676',
    token: 'a9b515a0-c97c-44a0-83b8-3d883d7a24bd',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 4,
    imageName: 'bonnie.jpg',
    token: 'bf25b6d0-f895-4f70-ac2b-f55ae03971b2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const picture of pictures) {
      const existedPicture = await queryInterface.rawSelect(
        'ProfilePictures',
        {
          where: {
            profileId: picture.profileId,
          },
        },
        ['id'],
      );

      if (!existedPicture || existedPicture.length === 0) await queryInterface.bulkInsert('ProfilePictures', [picture], {});
      else {
        console.log(
          `O perfil de id ${picture.profileId} ja tem uma foto de perfil`,
        );
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('ProfilePictures', pictures, {}),
};

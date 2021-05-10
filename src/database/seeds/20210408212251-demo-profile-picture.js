/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const pictures = [
  {
    profileId: 1,
    imageName: 'finn.jpg',
    token: '10621565-fb77-43cd-9f0b-844c06903a2c',
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
    imageName: 'marcy.jpg',
    token: 'ccb72932-4c41-45cd-9f51-3078a1b51503',
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
        ['id']
      );

      if (!existedPicture || existedPicture.length === 0)
        await queryInterface.bulkInsert('ProfilePictures', [picture], {});
      else {
        console.log(
          `O perfil de id ${picture.profileId} ja tem uma foto de perfil`
        );
      }
    }
  },

  down: (queryInterface) =>
    queryInterface.bulkDelete('ProfilePictures', pictures, {}),
};

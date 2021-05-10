/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const pictures = [
  {
    posterId: 1,
    image_name: 'finn.jpg',
    token: '10621565-fb77-43cd-9f0b-844c06903a2c',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    image_name: 'jake.png',
    token: '73750e8e-0770-40f5-b2c5-4883faf64647',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    image_name: 'marcy.jpg',
    token: 'ccb72932-4c41-45cd-9f51-3078a1b51503',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
module.exports = {
  up: async (queryInterface) => {
    for (const picture of pictures) {
      const existedPicture = await queryInterface.rawSelect(
        'PosterPictures',
        {
          where: {
            posterId: picture.posterId,
          },
        },
        ['id']
      );

      if (!existedPicture)
        await queryInterface.bulkInsert('PosterPictures', [picture], {});
      else {
        console.log(
          `O perfil de id ${picture.posterId} ja tem uma foto de perfil`
        );
      }
    }
  },

  down: (queryInterface) =>
    queryInterface.bulkDelete('PosterPictures', pictures, {}),
};

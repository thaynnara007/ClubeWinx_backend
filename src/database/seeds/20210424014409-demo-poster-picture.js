/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const pictures = [
  {
    posterId: 1,
    image_name: 'o6Z2Mv.jpg_1619707689907',
    token: 'fde5908f-e6ca-4392-b8f3-2412366ae793',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    image_name:
      'adventure-time-tree-house-nature-mountains-hd-wallpaper-preview.jpg_1620599764356',
    token: '8f7b8336-7cdc-4503-8850-de0715a5fecd',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    image_name: 'house-1.jpg_1620263922353',
    token: 'f3a4d122-1988-47be-9566-d0b3f16529e7',
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
        ['id'],
      );

      if (!existedPicture) await queryInterface.bulkInsert('PosterPictures', [picture], {});
      else {
        console.log(
          `O perfil de id ${picture.posterId} ja tem uma foto de perfil`,
        );
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('PosterPictures', pictures, {}),
};

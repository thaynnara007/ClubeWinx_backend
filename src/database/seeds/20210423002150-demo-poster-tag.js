/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const posterTags = [
  {
    posterId: 1,
    tagId: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 61,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 13,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 69,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 1,
    tagId: 37,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    posterId: 2,
    tagId: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const posterTag of posterTags) {
      const existedTag = await queryInterface.rawSelect(
        'PosterTags',
        {
          where: {
            posterId: posterTag.posterId,
            tagId: posterTag.tagId,
          },
        },
        ['id']
      );

      if (!existedTag || existedTag.length === 0)
        await queryInterface.bulkInsert('PosterTags', [posterTag], {});
      else {
        console.log(
          `O perfil de id ${posterTag.posterId} ja tem a tag de id ${posterTag.tagId}`
        );
      }
    }
  },

  down: (queryInterface) =>
    queryInterface.bulkDelete('PosterTags', posterTags, {}),
};

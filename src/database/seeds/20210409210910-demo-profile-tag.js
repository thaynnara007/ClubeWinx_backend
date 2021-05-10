/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const profileTags = [
  {
    profileId: 1,
    tagId: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 1,
    tagId: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 1,
    tagId: 61,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 2,
    tagId: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 2,
    tagId: 13,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 2,
    tagId: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 2,
    tagId: 69,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 3,
    tagId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 3,
    tagId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 3,
    tagId: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 3,
    tagId: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 4,
    tagId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 4,
    tagId: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 4,
    tagId: 37,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    profileId: 4,
    tagId: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const profileTag of profileTags) {
      const existedTag = await queryInterface.rawSelect(
        'ProfileTags',
        {
          where: {
            profileId: profileTag.profileId,
            tagId: profileTag.tagId,
          },
        },
        ['id']
      );

      if (!existedTag || existedTag.length === 0)
        await queryInterface.bulkInsert('ProfileTags', [profileTag], {});
      else {
        console.log(
          `O perfil de id ${profileTag.profileId} ja tem a tag de id ${profileTag.tagId}`
        );
      }
    }
  },

  down: (queryInterface) =>
    queryInterface.bulkDelete('ProfileTags', profileTags, {}),
};

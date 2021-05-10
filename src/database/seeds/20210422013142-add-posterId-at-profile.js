/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const profiles = [
  {
    profileId: 1,
    posterId: 1,
  },
  {
    profileId: 3,
    posterId: 2,
  },
  {
    profileId: 2,
    posterId: 1,
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const profile of profiles) {
      const existedProfile = await queryInterface.rawSelect(
        'Profiles',
        {
          where: {
            id: profile.profileId,
          },
        },
        ['id']
      );

      if (!existedProfile.posterId) {
        await queryInterface.bulkUpdate(
          'Profiles',
          {
            posterId: profile.posterId,
          },
          {
            id: profile.profileId,
          }
        );
      } else {
        console.log(
          `O profile de id ${profile.profileId} ja está vinculado a um poster`
        );
      }
    }
  },

  down: async (queryInterface) => {
    for (const profile of profiles) {
      const existedProfile = await queryInterface.rawSelect(
        'Profiles',
        {
          where: {
            id: profile.profileId,
          },
        },
        ['id']
      );

      if (existedProfile.posterId) {
        await queryInterface.bulkUpdate(
          'Profiles',
          {
            posterId: null,
          },
          {
            id: null,
          }
        );
      } else {
        console.log(
          `O profile de id ${profile.profileId} não está vinculado a um poster`
        );
      }
    }
  },
};

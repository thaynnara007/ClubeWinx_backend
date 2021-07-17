/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const profiles = [
  {
    userId: 1,
    socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
    description:
      'I am a human boy, who lives in a tree house with my brother, Jake, we have an adventure business together. I am good with people and know how to cook, though jake knows it more',
    privateAtConnection: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 2,
    socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
    description:
      'I am a magical dog, who lives in a tree house with my brother, Finn, we have an adventure business together. I have a girlfriend and children',
    privateAtConnection: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
    description:
      'I am the vampire queen, who lives in a cave shaped like home. I am a thousand years old and I like to play my axe bass.',
    privateAtConnection: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 4,
    socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
    description:
      'I am a bubblegum and a run my own kingdom, The Candy Kingdom. I love science and my girlfriend, but more science.',
    privateAtConnection: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const profile of profiles) {
      const existedProfile = await queryInterface.rawSelect(
        'Profiles',
        {
          where: {
            userId: profile.userId,
          },
        },
        ['id'],
      );

      if (!existedProfile || existedProfile.length === 0) await queryInterface.bulkInsert('Profiles', [profile], {});
      else {
        console.log(`O usuário de id ${profile.userId} ja tem um perfil`);
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Profiles', profiles, {}),
};

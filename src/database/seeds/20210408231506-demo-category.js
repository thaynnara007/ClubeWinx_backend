/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const categories = [
  {
    name: 'Moradia',
    description:
      'Contempla as tags que visam definir aspectos da moradia a ser dividida',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Saúde',
    description: 'Contempla as tags que visam definir alguma condição de saúde',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Estudante',
    description:
      'Contempla as tags que visam nomear os diferentes ambitos universitários',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Curso',
    description: 'Contempla as tags que visam nomear os cursos de graduação',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Animais',
    description: 'Contempla as tags que visam nomear os animais domésticos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Minorias',
    description:
      'Contempla as tags que visam nomear os diferentes grupos considerados como minoria. Exemplo: mulhres, LGBTQ+, povo indígina, etc.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sobre você',
    description:
      'Contempla as tags que visam te descrever como pessoa',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const category of categories) {
      const existedCategory = await queryInterface.rawSelect(
        'Categories',
        {
          where: {
            name: category.name,
          },
        },
        ['id'],
      );

      if (!existedCategory || existedCategory.length === 0) await queryInterface.bulkInsert('Categories', [category], {});
      else {
        console.log(`A categoria de nome ${category.name} ja foi registrada.`);
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Categories', categories, {}),
};

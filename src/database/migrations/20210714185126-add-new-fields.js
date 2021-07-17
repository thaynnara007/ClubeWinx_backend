module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posters', 'bathrooms', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    });

    await queryInterface.addColumn('Posters', 'beds', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    });

    await queryInterface.addColumn('Posters', 'headerImage', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    });

    return queryInterface.addColumn('Profiles', 'headerImage', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Posters', 'bathrooms');

    await queryInterface.removeColumn('Posters', 'beds');

    await queryInterface.removeColumn('Posters', 'headerImage');

    return queryInterface.removeColumn('Profiles', 'headerImage');
  },
};

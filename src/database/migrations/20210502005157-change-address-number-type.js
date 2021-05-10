module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('Addresses', 'number', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('Addresses', 'number', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]),
};

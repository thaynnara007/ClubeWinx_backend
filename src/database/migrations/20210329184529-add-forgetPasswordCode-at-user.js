module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'forgetPasswordCode', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    }),

  down: (queryInterface) =>
    queryInterface.removeColumn('Users', 'forgetPasswordCode'),
};

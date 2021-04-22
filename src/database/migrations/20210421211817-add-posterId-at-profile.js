module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Profiles', 'posterId', {
    type: Sequelize.INTEGER,
    unique: false,
    references: {
      model: 'Posters',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }),

  down: (queryInterface) => queryInterface.removeColumn('Profiles', 'posterId'),
};
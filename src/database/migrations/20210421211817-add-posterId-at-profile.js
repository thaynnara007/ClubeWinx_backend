module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Profiles', 'posterId', {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: true,
    references: {
      model: 'Posters',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  }),

  down: (queryInterface) => queryInterface.removeColumn('Profiles', 'posterId'),
};

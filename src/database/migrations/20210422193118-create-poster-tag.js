module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PosterTags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    posterId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Posters',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('PosterTags'),
};

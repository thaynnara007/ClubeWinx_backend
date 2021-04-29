module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PosterPictures', {
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
    image_name: {
      type: Sequelize.STRING,
      unique: true,
    },
    token: {
      type: Sequelize.STRING,
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
  down: (queryInterface) => queryInterface.dropTable('PosterPictures'),
};

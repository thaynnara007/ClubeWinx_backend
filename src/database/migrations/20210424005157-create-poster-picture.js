module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PosterPictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posters',
          key: 'id',
        },
        onUpdate: 'CASCADE',
      },
      imageName: {
        type: Sequelize.STRING,
        unique: true,
      },
      token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PosterPictures'),
};
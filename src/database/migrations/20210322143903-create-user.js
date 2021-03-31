module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    lastname: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    birthday: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
    gender: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};

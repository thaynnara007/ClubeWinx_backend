module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Usuarios', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    nome: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    sobrenome: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    dataDeNascimento: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
    genero: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    senhaHash: {
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
  down: (queryInterface) => queryInterface.dropTable('Usuarios'),
};

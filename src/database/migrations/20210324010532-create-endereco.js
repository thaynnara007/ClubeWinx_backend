module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Enderecos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    usuarioId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    rua: {
      type: Sequelize.STRING,
    },
    numero: {
      type: Sequelize.INTEGER,
    },
    bairro: {
      type: Sequelize.STRING,
    },
    complemento: {
      type: Sequelize.TEXT,
    },
    cep: {
      type: Sequelize.STRING,
    },
    cidade: {
      type: Sequelize.STRING,
    },
    estado: {
      type: Sequelize.STRING,
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
  down: (queryInterface) => queryInterface.dropTable('Enderecos'),
};

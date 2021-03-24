module.exports = (sequelize, DataTypes) => {
  const Endereco = sequelize.define(
    'Endereco',
    {
      rua: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      numero: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      bairro: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      complemento: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      cep: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      cidade: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {},
  );
  Endereco.associate = (models) => {
    Endereco.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };
  return Endereco;
};

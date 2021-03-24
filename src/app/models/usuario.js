/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      nome: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      sobrenome: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      dataDeNascimento: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      genero: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      senha: DataTypes.VIRTUAL,
      senhaHash: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['senha', 'senhaHash'],
        },
      },
    },
  );

  Usuario.associate = () => {};

  Usuario.addHook('beforeSave', async (usuario) => {
    if (usuario.senha) usuario.senhaHash = await bcrypt.hash(usuario.senha, 5);

    return usuario;
  });

  Usuario.prototype.comparaSenha = (senha) => bcrypt.compare(senha, this.senhaHash);

  return Usuario;
};

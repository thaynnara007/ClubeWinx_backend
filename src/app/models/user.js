/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      lastname: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      birthday: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.VIRTUAL,
      passwordHash: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'passwordHash'] },
      },
    },
  );

  User.associate = () => {};

  User.addHook('beforeSave', async (user) => {
    if (user.password) user.passwordHash = await bcrypt.hash(user.password, 5);

    return user;
  });

  User.prototype.checkPassword = (password) => bcrypt.compare(password, this.passwordHash);

  return User;
};

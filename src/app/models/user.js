/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/environment');

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
      forgetPasswordCode: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['password', 'passwordHash', 'forgetPasswordCode'],
        },
      },
    },
  );

  User.associate = () => {};

  User.addHook('beforeSave', async (user) => {
    if (user.password) user.passwordHash = await bcrypt.hash(user.password, 5);

    return user;
  });

  User.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.generateAuthToken = function generateAuthToken(expire = true) {
    const { secret, expirationDays } = config.JWT;

    if (expire) {
      return jwt.sign({ id: this.id }, secret, {
        expiresIn: `${expirationDays}d`,
      });
    }

    return jwt.sign({ id: this.id }, secret);
  };

  return User;
};

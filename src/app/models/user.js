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

  User.associate = (models) => {
    User.hasOne(models.Address, {
      foreignKey: 'userId',
      as: 'address',
    });
    User.hasOne(models.Poster, {
      foreignKey: 'userId',
      as: 'poster',
    });
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
    });
    User.belongsToMany(models.User, {
      through: 'ConnectionRequests',
      as: 'requestedUsers',
      foreignKey: 'requestedUserId',
    });
    User.belongsToMany(models.User, {
      through: 'ConnectionRequests',
      as: 'sendedUsers',
      foreignKey: 'sendedUserId',
    });
  };

  User.addHook('beforeSave', async (user) => {
    if (user.password) user.passwordHash = await bcrypt.hash(user.password, 5);

    return user;
  });

  User.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.checkForgetPasswordCode = function checkForgetPasswordCode(
    code,
  ) {
    return bcrypt.compare(code, this.forgetPasswordCode);
  };

  User.prototype.generateAuthToken = function generateAuthToken(
    forgetPassword = false,
  ) {
    const { secret, expirationMinutes } = config.JWT;

    if (forgetPassword) {
      return jwt.sign({ id: this.id }, secret, {
        expiresIn: `${expirationMinutes}m`,
      });
    }

    return jwt.sign({ id: this.id }, secret);
  };

  return User;
};

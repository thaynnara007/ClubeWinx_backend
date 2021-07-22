'use strict';
const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const ProfileHeaderImage = sequelize.define('ProfileHeaderImage', {
    imageName: {
      type: DataTypes.STRING,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
    },
    pictureUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        return `https://firebasestorage.googleapis.com/v0/b/${
          FIREBASE.storageBucket
        }/o/${this.getDataValue(
          'imageName',
        )}?alt=media&token=${this.getDataValue('token')}`;
      },
    },
  }, {});
  ProfileHeaderImage.associate = (models) => {
    ProfileHeaderImage.belongsTo(models.Profile, {
      foreignKey: 'profileId',
      as: 'profile',
    });
  };
  return profileHeaderImage;
};
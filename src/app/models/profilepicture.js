const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const ProfilePicture = sequelize.define(
    'ProfilePicture',
    {
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
            'imageName'
          )}?alt=media&token=${this.getDataValue('token')}`;
        },
      },
    },
    {}
  );
  ProfilePicture.associate = (models) => {
    ProfilePicture.belongsTo(models.Profile, {
      foreignKey: 'profileId',
      as: 'profile',
    });
  };
  return ProfilePicture;
};

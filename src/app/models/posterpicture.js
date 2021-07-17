const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const PosterPicture = sequelize.define(
    'PosterPicture',
    {
      image_name: {
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
            'image_name',
          )}?alt=media&token=${this.getDataValue('token')}`;
        },
      },
    },
    {},
  );
  PosterPicture.associate = (models) => {
    PosterPicture.belongsTo(models.Poster, {
      foreignKey: 'posterId',
      as: 'poster',
      onDelete: 'CASCADE',
    });
  };
  return PosterPicture;
};

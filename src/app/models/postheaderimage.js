const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const PosterHeaderImage = sequelize.define(
    'PosterHeaderImage',
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
            'imageName',
          )}?alt=media&token=${this.getDataValue('token')}`;
        },
      },
    },
    {},
  );
  PosterHeaderImage.associate = (models) => {
    PosterHeaderImage.belongsTo(models.Poster, {
      foreignKey: 'posterId',
      as: 'poster',
    });
  };

  return PosterHeaderImage;
};

module.exports = (sequelize, DataTypes) => {
  const Poster = sequelize.define(
    'Poster',
    {
      expense: DataTypes.FLOAT,
      description: DataTypes.STRING,
      residents: DataTypes.INTEGER,
      vacancies: DataTypes.INTEGER,
      bathrooms: DataTypes.INTEGER,
      beds: DataTypes.INTEGER,
      headerImage: DataTypes.STRING,
    },
    {},
  );

  Poster.associate = (models) => {
    Poster.belongsToMany(models.Tag, {
      through: 'PosterTags',
      as: 'tags',
      foreignKey: 'posterId',
    });
    Poster.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });
    Poster.hasMany(models.Profile, {
      foreignKey: 'posterId',
      as: 'profiles',
      onUpdate: 'cascade',
    });
    Poster.hasMany(models.PosterPicture, {
      foreignKey: 'posterId',
      as: 'posterPictures',
      onUpdate: 'cascade',
    });
  };

  return Poster;
};

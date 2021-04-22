module.exports = (sequelize, DataTypes) => {
  const Poster = sequelize.define(
    'Poster',
    {
      expense: DataTypes.FLOAT,
      description: DataTypes.STRING,
      residents: DataTypes.INTEGER,
      vacancies: DataTypes.INTEGER,
    },
    {},
  );
  Poster.associate = (models) => {
    Poster.belogsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });
    Poster.hasMany(models.Profile, {
      foreignKey: 'profileId',
      as: 'residents',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
    Poster.belongsToMany(models.Tag, {
      through: 'PosterTags',
      as: 'tags',
      foreignKey: 'posterId',
    });
  };

  return Poster;
};

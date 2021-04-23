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
    Poster.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });
    Poster.hasMany(models.Profile, {
      foreignKey: 'posterId',
      as: 'profiles',
      onUpdate: 'cascade',
    });
  };
  return Poster;
};

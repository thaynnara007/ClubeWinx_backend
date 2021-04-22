module.exports = (sequelize, DataTypes) => {
  const PosterTag = sequelize.define('PosterTag', {}, {});
  
  PosterTag.associate = (models) => {
    PosterTag.belongsTo(models.Poster, {
      foreignKey: 'posterId',
      as: 'poster',
      onDelete: 'CASCADE',
    });
    PosterTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      as: 'tag',
      onDelete: 'CASCADE',
    });
  };
  return PosterTag;
};
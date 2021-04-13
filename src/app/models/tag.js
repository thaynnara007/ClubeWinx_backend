module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      isFixed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {},
  );
  Tag.associate = (models) => {
    Tag.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Tag.belongsToMany(models.ProfileTag, {
      through: 'ProfileTags',
      as: 'profiles',
      foreignKey: 'tagId',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  };
  return Tag;
};

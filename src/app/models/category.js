module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {},
  );
  Category.associate = (models) => {
    Category.hasMany(models.Tag, {
      foreignKey: 'categoryId',
      as: 'tags',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  };
  return Category;
};

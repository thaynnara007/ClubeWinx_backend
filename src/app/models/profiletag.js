module.exports = (sequelize) => {
  const ProfileTag = sequelize.define('ProfileTag', {}, {});

  ProfileTag.associate = (models) => {
    ProfileTag.belongsTo(models.Profile, {
      foreignKey: 'profileId',
      as: 'profile',
      onDelete: 'CASCADE',
    });
    ProfileTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      as: 'tag',
      onDelete: 'CASCADE',
    });
  };
  return ProfileTag;
};

module.exports = (sequelize) => {
  const ProfileTag = sequelize.define('ProfileTag', {}, {});

  ProfileTag.associate = (models) => {
    ProfileTag.belongsTo(models.Profile, { foreignKey: 'profileId' });
    ProfileTag.belongsTo(models.Tag, { foreignKey: 'tagId' });
  };
  return ProfileTag;
};

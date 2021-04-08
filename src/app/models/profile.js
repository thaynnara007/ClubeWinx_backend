module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      socialMedia: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      privateAtConnection: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {},
  );
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Profile.hasOne(models.ProfilePicture);
  };
  return Profile;
};

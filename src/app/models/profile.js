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
    Profile.hasOne(models.ProfilePicture, {
      foreignKey: 'profileId',
      as: 'picture',
    });
    Profile.belongsToMany(models.ProfileTag, {
      through: 'ProfileTags',
      as: 'tags',
      foreignKey: 'profileId',
    });
  };
  return Profile;
};

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
      headerImage: DataTypes.STRING,
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
      onDelete: 'CASCADE',
    });
    Profile.belongsToMany(models.Tag, {
      through: 'ProfileTags',
      as: 'tags',
      foreignKey: 'profileId',
      onDelete: 'CASCADE',
    });
    Profile.belongsTo(models.Poster, {
      foreignKey: 'posterId',
      as: 'residence',
    });
  };
  return Profile;
};

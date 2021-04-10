module.exports = (sequelize, DataTypes) => {
  const ConnectionRequest = sequelize.define(
    'ConnectionRequest',
    {
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {},
  );
  ConnectionRequest.associate = (models) => {
    ConnectionRequest.belongsTo(models.User, {
      foreignKey: 'requestedUserId',
      as: 'requestedUser',
      onDelete: 'CASCADE',
    });
    ConnectionRequest.belongsTo(models.User, {
      foreignKey: 'sendedUserId',
      as: 'sendedUser',
      onDelete: 'CASCADE',
    });
  };
  return ConnectionRequest;
};

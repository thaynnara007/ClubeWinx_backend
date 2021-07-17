module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      street: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      number: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      district: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      complement: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      zipCode: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {},
  );
  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return Address;
};

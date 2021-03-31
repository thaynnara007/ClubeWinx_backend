const { Address } = require('../models');

const create = async (addressData) => {
  const address = await Address.create(addressData);

  return address;
};

const getById = async () => {};
const getAll = async () => {};

const getByUserId = async (userId) => {
  const address = await Address.findOne({
    where: {
      userId,
    },
  });

  return address;
};

const edit = async (userId, addressData) => {
  await Address.update(addressData, {
    where: {
      userId,
    },
  });

  return getByUserId(userId);
};
const delet = async (userId) => {
  const address = await getByUserId(userId);

  if (!address) throw new Error('Nenhum endereço encontrado para esse usuário');

  return address.destroy();
};

module.exports = {
  create,
  getById,
  getAll,
  getByUserId,
  edit,
  delet,
};

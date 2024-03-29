const bcrypt = require('bcryptjs');
const { User } = require('../models');

const getById = async (userId) => {
  const user = await User.findByPk(userId);

  return user;
};

const create = async (userData) => {
  const newUser = await User.create(userData);

  return getById(newUser.dataValues.id);
};

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let users = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
    };
    users = await User.findAndCountAll(options);

    users.pages = Math.ceil(users.count / pageSize);
  } else {
    users = await User.findAll();
  }

  return users;
};

const getByEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  return user;
};

const edit = async (userId, userData) => {
  await User.update(userData, {
    where: {
      id: userId,
    },
  });

  return getById(userId);
};

const delet = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error('Usuário não encontrado');

  return user.destroy();
};

const saveForgetPasswordCode = async (code, email) => {
  const codeHash = await bcrypt.hash(`${code}`, 5);
  const userData = {
    forgetPasswordCode: codeHash,
  };

  await User.update(userData, {
    where: {
      email,
    },
  });
};

const changePassword = async (user, newPassword) => {
  const updatedUser = user;

  updatedUser.password = newPassword;
  updatedUser.forgetPasswordCode = null;

  await updatedUser.save();
};

module.exports = {
  create,
  getById,
  getAll,
  getByEmail,
  edit,
  delet,
  saveForgetPasswordCode,
  changePassword,
};

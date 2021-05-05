const { Op } = require('sequelize');
const { Tag } = require('../models');

const create = async (data) => {
  const tag = await Tag.create(data);

  return tag;
};

const getByName = async (name) => {
  const tag = await Tag.findOne({
    where: {
      name: {
        [Op.iLike]: name
      }
    },
  });

  return tag;
};

const getById = async (id) => {
  const tag = await Tag.findOne({
    where: {
      id,
    },
  });

  return tag;
};

module.exports = {
  create,
  getById,
  getByName,
};

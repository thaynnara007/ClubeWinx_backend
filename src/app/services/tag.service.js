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
        [Op.iLike]: name,
      },
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

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let tags = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
    };
    tags = await Tag.findAndCountAll(options);

    tags.pages = Math.ceil(tags.count / pageSize);
  } else {
    tags = await Tag.findAll();
  }

  return tags;
}

module.exports = {
  create,
  getById,
  getByName,
  getAll
};

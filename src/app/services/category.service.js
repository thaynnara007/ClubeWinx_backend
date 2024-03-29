const { Op } = require('sequelize');
const { Category, Tag, Profile } = require('../models');

const create = async (data) => {
  const category = await Category.create(data);

  return category;
};

const getByName = async (name) => {
  const category = await Category.findOne({
    where: {
      name,
    },
  });

  return category;
};

const getById = async (id) => {
  const category = Category.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        order: [['name', 'ASC']],
      },
    ],
  });

  return category;
};

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let categories = null;
  let options = {
    distinct: true,
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [
      ['name', 'ASC'],
      [{ model: Tag, as: 'tags' }, 'name', 'ASC'],
    ],
  };

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    options = {
      ...options,
      limit: pageSize,
      offset,
    };

    categories = await Category.findAndCountAll(options);

    categories.pages = Math.ceil(categories.count / pageSize);
  } else {
    categories = await Category.findAll(options);
  }

  return categories;
};

const edit = async (categoryId, data) => {
  await Category.update(data, {
    where: {
      id: categoryId,
    },
  });

  return getById(categoryId);
};

const getProfilesByCategories = async (categoriesIds, profileId) => {
  const result = await Category.findAll({
    where: {
      id: {
        [Op.or]: categoriesIds,
      },
    },
    attributes: {
      exclude: ['description', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['isFixed', 'createdAt', 'updatedAt'],
        },
        include: [
          {
            model: Profile,
            as: 'profiles',
            where: {
              id: {
                [Op.not]: profileId,
              },
            },
            attributes: {
              exclude: [
                'userId',
                'posterId',
                'privateAtConnection',
                'description',
                'socialMedia',
                'createdAt',
                'updatedAt',
              ],
            },
          },
        ],
      },
    ],
  });

  return result;
};

module.exports = {
  create,
  getByName,
  getById,
  getAll,
  edit,
  getProfilesByCategories,
};

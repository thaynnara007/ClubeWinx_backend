const { Poster, User, Address } = require('../models');

const getByUserId = async (userId) => {
  const poster = await Poster.findOne({
    where: {
      userId,
    },
  });

  return poster;
};

const getById = async (id) => {
  const poster = await Poster.findOne({
    where: {
      id,
    },
  });

  return poster;
};

const create = async (data) => {
  const poster = await Poster.create(data);

  return getById(poster.id);
};

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let posters = null;
  let options = {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: {
          exclude: [
            'name',
            'lastname',
            'birthday',
            'email',
            'phoneNumber',
            'gender',
            'passwordHash',
            'forgetPasswordCode',
            'createdAt',
            'updatedAt',
          ],
        },
        include: {
          model: Address,
          as: 'address',
        },
      },
    ],
  };

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    options = {
      ...options,
      limit: pageSize,
      offset,
      distinct: true,
    };
    posters = await Poster.findAndCountAll(options);

    posters.pages = Math.ceil(posters.count / pageSize);
  } else {
    posters = await Poster.findAll(options);
  }

  return posters;
};

const edit = async (id, data) => {
  await Poster.update(data, {
    where: {
      id,
    },
  });

  return getById(id);
};

const delet = async (poster) => poster.destroy();

module.exports = {
  getByUserId,
  create,
  getById,
  getAll,
  edit,
  delet,
};
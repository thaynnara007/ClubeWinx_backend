const { Poster } = require('../models')

const getByUserId = async (userId) => {
  const poster = await Poster.findOne({
    where: {
      userId: userId
    }
  })

  return poster
}

const create = async (data) => {
  const poster = await Poster.create(data)

  return poster
}

const getById = async(id) => {
  const poster = await Poster.findOne({
    where: {
      id
    }
  })

  return poster
}

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let posters = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
    };
    posters = await Poster.findAndCountAll(options);

    posters.pages = Math.ceil(posters.count / pageSize);
  } else {
    posters = await Poster.findAll();
  }

  return posters;
}

module.exports = {
  getByUserId,
  create,
  getById,
  getAll
}
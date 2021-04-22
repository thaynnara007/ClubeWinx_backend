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

module.exports = {
  getByUserId,
  create,
  getById
}
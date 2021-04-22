const { Poster } = require('../models')

const getByUserId = async (userId) => {
  const poster = await Poster.findOne({
    where: {
      ownerId: userId
    }
  })

  return poster
}

const create = async (data) => {
  const poster = await Poster.create(data)

  return poster
}

module.exports = {
  getByUserId,
  create
}
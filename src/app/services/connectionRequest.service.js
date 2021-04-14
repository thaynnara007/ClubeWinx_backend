const { ConnectionRequest } = require('../models')
const { Op } = require('sequelize')

const create = async (data) => {
  const connection = await ConnectionRequest.create(data)

  return connection
}

const getByUsers = async (userId1, userId2) => {
  const connection = await ConnectionRequest.findOne({
    where: {
      requestedUserId: {
        [Op.or]: [userId1, userId2]
      },
      sendedUserId: {
        [Op.or]: [userId1, userId2]
      }
    }
  })

  return connection
}

module.exports = {
  create,
  getByUsers
}
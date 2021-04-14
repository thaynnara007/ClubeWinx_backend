const { ConnectionRequest } = require('../models')
const { Op } = require('sequelize')

const create = async (data) => {
  const request = await ConnectionRequest.create(data)

  return request
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

const getById = async (id) => {
  const request = await ConnectionRequest.findByPk(id)

  return request
}

const acceptConnection = async (request) => {
  const acceptedConnection = request
  acceptedConnection.accepted = true

  await acceptedConnection.save()
}

module.exports = {
  create,
  getByUsers,
  getById,
  acceptConnection
}
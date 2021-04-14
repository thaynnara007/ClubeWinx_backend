const { Op } = require('sequelize');
const { ConnectionRequest } = require('../models');

const create = async (data) => {
  const request = await ConnectionRequest.create(data);

  return request;
};

const getByUsers = async (userId1, userId2) => {
  const connection = await ConnectionRequest.findOne({
    where: {
      requestedUserId: {
        [Op.or]: [userId1, userId2],
      },
      sendedUserId: {
        [Op.or]: [userId1, userId2],
      },
    },
  });

  return connection;
};

const getById = async (id) => {
  const request = await ConnectionRequest.findByPk(id);

  return request;
};

const acceptConnection = async (request) => {
  const acceptedConnection = request;
  acceptedConnection.accepted = true;

  await acceptedConnection.save();
};

const removeConnection = async (request) => {
  const connection = request;

  await connection.destroy();
};

const getAll = async (query, accepted, userId) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let connections = null;
  let options = {
    where: {
      [Op.or]: [
        {
          requestedUserId: userId,
        },
        {
          sendedUserId: userId,
        },
      ],
      accepted,
    },
  };

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    options = {
      ...options,
      limit: pageSize,
      offset,
      distinct: true,
    };
    connections = await ConnectionRequest.findAndCountAll(options);

    connections.pages = Math.ceil(connections.count / pageSize);
  } else {
    connections = await ConnectionRequest.findAll(options);
  }

  return connections;
};

module.exports = {
  create,
  getByUsers,
  getById,
  acceptConnection,
  removeConnection,
  getAll,
};

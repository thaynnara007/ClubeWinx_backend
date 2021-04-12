/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const requests = [
  {
    requestedUserId: 1,
    sendedUserId: 2,
    accepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    requestedUserId: 1,
    sendedUserId: 4,
    accepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    requestedUserId: 1,
    sendedUserId: 3,
    accepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    requestedUserId: 2,
    sendedUserId: 4,
    accepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    requestedUserId: 3,
    sendedUserId: 4,
    accepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    requestedUserId: 3,
    sendedUserId: 2,
    accepted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const request of requests) {
      const existedRequest = await queryInterface.rawSelect(
        'ConnectionRequests',
        {
          where: {
            requestedUserId: request.requestedUserId,
            sendedUserId: request.sendedUserId,
          },
        },
        ['id'],
      );

      if (!existedRequest || existedRequest.length === 0) await queryInterface.bulkInsert('ConnectionRequests', [request], {});
      else {
        console.log(
          `O usuário de id ${request.requestedUserId} ja solicitou conexão com o usuário de id ${request.sendedUserId}`,
        );
      }
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('ConnectionRequests', requests, {}),
};

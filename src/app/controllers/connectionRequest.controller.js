const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/connectionRequest.service');
const userService = require('../services/user.service');

const { StatusCodes } = httpStatus;

const requestConnection = async (req, res) => {
  try {
    const { user } = req;
    const { userId } = req.params;

    log.info(
      `Inicializando criação da requisição de conexão. sendedId=${user.id}, requestedUser=${userId}`
    );
    log.info('Validando informações');

    if (`${user.id}` === userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Um usuário não pode conectar-se consigo mesmo' });
    }

    const requestedUser = await userService.getById(userId);

    if (!requestedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    const connection = await service.getByUsers(user.id, userId);

    if (connection) {
      return res.status(StatusCodes.CONFLICT).json({
        error:
          'Esses usuários já são conectados ou já existe uma requisição de conexão entre ambos',
      });
    }

    log.info(
      `Criando requisição de conexão no banco de dados. requestedUserId=${userId}, sendedUserId=${user.id}`
    );
    await service.create({
      requestedUserId: userId,
      sendedUserId: user.id,
    });

    log.info('Requisição de conexão criada com sucesso');

    return res
      .status(StatusCodes.CREATED)
      .json('Requisição de conexão feita com sucesso');
  } catch (error) {
    const errorMsg = 'Erro ao  fazer uma requisição de conexão';

    log.error(
      errorMsg,
      'app/controllers/connectionRequest.controller.js',
      error.message
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const acceptConnection = async (req, res) => {
  try {
    const { user } = req;
    const { requestId } = req.params;

    log.info(
      `Inicializando a confirmação de conexão. userId=${user.id}, requestId=${requestId}`
    );
    log.info('Validando informações');

    const request = await service.getById(requestId);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Requisição de conexão não encontrada' });
    }

    if (request.requestedUserId !== user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Você não pode aceitar as requisições de outros usuários',
      });
    }

    log.info(
      `Aceitando requisição de conexão no banco de dados. requestId=${requestId}`
    );
    await service.acceptConnection(request);

    log.info('Requisição de conexão aceita com sucesso');

    return res.status(StatusCodes.OK).json('Requisição de conexão aceita');
  } catch (error) {
    const errorMsg = 'Erro ao aceitar uma requisição de conexão';

    log.error(
      errorMsg,
      'app/controllers/connectionRequest.controller.js',
      error.message
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const refuseConnection = async (req, res) => {
  try {
    const { user } = req;
    const { requestId } = req.params;

    log.info(
      `Inicializando recusa da conexão. userId=${user.id}, requestId=${requestId}`
    );
    log.info('Validando informações');

    const request = await service.getById(requestId);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Requisição de conexão não encontrada' });
    }

    if (
      request.accepted &&
      request.requestedUserId !== user.id &&
      request.sendedUserId !== user.id
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Você não pode encerrar a conexões entre outros usuários',
      });
    }

    if (!request.accepted && request.requestedUserId !== user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Você não pode recusar uma conexões por outros usuários',
      });
    }

    log.info(
      `Removendo requisição de conexão no banco de dados. requestId=${requestId}`
    );
    await service.removeConnection(request);

    log.info('Requisição de conexão removida com sucesso');

    return res.status(StatusCodes.OK).json('Requisição de conexão removida');
  } catch (error) {
    const errorMsg = 'Erro ao recusar uma requisição de conexão';

    log.error(
      errorMsg,
      'app/controllers/connectionRequest.controller.js',
      error.message
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getConnections = async (req, res) => {
  try {
    const { user, query } = req;

    const accepted = query.accepted === 'true';

    log.info(`Inicializando busca das conexões do usuário. userId=${user.id}`);

    if (accepted) log.info(`Buscando conexões do usuário. userId=${user.id}`);
    else {
      log.info(
        `Buscando requisições conexões para o usuário. userId=${user.id}`
      );
    }

    const connections = await service.getAll(query, accepted, user.id);

    log.info('Conexões recuperadas com sucesso.');

    return res.status(StatusCodes.OK).json(connections);
  } catch (error) {
    const errorMsg = 'Erro ao buscar todas as conexões';

    log.error(
      errorMsg,
      'app/controllers/connectionRequest.controller.js',
      error.message
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  requestConnection,
  acceptConnection,
  refuseConnection,
  getConnections,
};

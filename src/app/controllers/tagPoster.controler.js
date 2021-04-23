const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/tagPoster.service');
const posterService = require('../services/poster.service');

const { StatusCodes } = httpStatus;

const addTags = async (req, res) => {
  try {
    const { user } = req;
    const { tags } = req.body;

    log.info(`Inicializando adição de tags ao poster. userId=${user.id}`);

    let poster = await posterService.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Poster não encontrado' });
    }

    log.info(`Relacionando as tags ao poster. posterId=${poster.id}`);
    await service.addTags(poster.id, tags);

    poster = await posterService.getById(user.id, false);

    log.info('Cadastro das tag realizado com sucesso');

    return res.status(StatusCodes.OK).json(poster);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar tags ao perfil';

    log.error(
      errorMsg,
      'app/controllers/tagposter.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const removeTags = async (req, res) => {
  try {
    const { user } = req;
    const { tags } = req.body;

    log.info(`Inicializando remoção das tags do poster. userId=${user.id}`);

    let poster = await posterService.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Poster não encontrado' });
    }

    log.info(`Removendo as tags do poster. posterId=${poster.id}`);
    await service.removeTags(poster.id, tags);

    poster = await posterService.getById(user.id, false);

    log.info('Remoção das tag realizado com sucesso');

    return res.status(StatusCodes.OK).json(poster);
  } catch (error) {
    const errorMsg = 'Erro ao remover tags do perfil';

    log.error(
      errorMsg,
      'app/controllers/tagposter.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  addTags,
  removeTags,
};

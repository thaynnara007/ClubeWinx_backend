const httpStatus = require('http-status-codes');
const service = require('../services/tag.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info('Iniciando busca por todas as tags');

    const result = await service.getAll(query);

    log.info('Finalizando busca por todoas as tags');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao buscar todas as tagss';

    log.error(errorMsg, 'app/controllers/tag.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

module.exports = { getAll }
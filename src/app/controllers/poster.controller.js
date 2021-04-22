const httpStatus = require('http-status-codes');
const service = require('../services/poster.service');
const profileService = require('../services/profile.service')
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { user, body } = req

    log.info(`Inicializando fluxo de criação de anúncio. userId=${user.id}`)
    log.info(`Buscando algum anúncio vinvulado ao usuário.userId=${user.id}`)

    const existedPoster = await service.getByUserId(user.id)

    if(existedPoster)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Usuário não pode ter mais de um anúncio` })

    log.info(`Buscando perfil do usuário. userId=${user.id}`)
    const profile = await profileService.getByUserId(user.id)

    if (profile.posterId) 
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Usuário ja é residente em algum anúncio` })

    const data = {
      userId: user.id,
      ...body
    }

    log.info(`Criando anúncio no banco de dados.userId=${user.id}`)
    const poster = await service.create(data)
    
    log.info(`Criação finalizada com sucesso`)

    return res.status(StatusCodes.CREATED).json(poster)
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const getMy = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao pegar meu anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const getById = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao buscar um anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const getAll = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao buscar todos os anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const edit = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao editar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const delet = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao deletar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

module.exports = {
  create,
  getMy,
  getById,
  getAll,
  edit,
  delet
}
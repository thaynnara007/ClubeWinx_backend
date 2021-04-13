const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/tagProfile.service');
const profileService = require('../services/profile.service');

const { StatusCodes } = httpStatus;

const addTags = async (req, res) => {
  try {
    const { user } = req
    const { tags } = req.body

    log.info(`Inicializando adição de tags ao profile. userId=${user.id}`)

    let profile = await profileService.getById(user.id)

    if(!profile)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Perfil não encontrado" })

    log.info(`Relacionando as tags ao perfil. profileId=${profile.id}`)
    await service.addTags(profile.id, tags)

    profile = await profileService.getById(user.id)

    log.info("Cadastro das tag realizado com sucesso")

    return res.status(StatusCodes.OK).json(profile)
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar tags ao perfil';

    log.error(errorMsg, 'app/controllers/tagProfile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const createTags = async (req, res) => {
  try {
    const { user } = req
    const { tags } = req.body

    log.info(`Inicializando adição das tags criadas pelo usuário ao profile. userId=${user.id}`)

    let profile = await profileService.getById(user.id)

    if(!profile)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Perfil não encontrado" })

    log.info(`Relacionando as tags ao perfil. profileId=${profile.id}`)
    await service.createTags(profile.id, tags)

    profile = await profileService.getById(user.id)

    log.info("Cadastro das tag realizado com sucesso")

    return res.status(StatusCodes.OK).json(profile)
  } catch (error) {
    const errorMsg = 'Erro ao adicionar tags criadas pelo usuário ao perfil';

    log.error(errorMsg, 'app/controllers/tagProfile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}

const removeTags = async (req, res) => {
  try {
    
  } catch (error) {
    const errorMsg = 'Erro ao remover tags do perfil';

    log.error(errorMsg, 'app/controllers/tagProfile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
}


module.exports = {
    addTags,
    removeTags,
    createTags,
}
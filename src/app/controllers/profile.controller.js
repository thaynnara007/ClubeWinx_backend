const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const util = require('../services/util.service');
const profileService = require('../services/profile.service');
const addressService = require('../services/address.service');
const profilePictureService = require('../services/profilePicture.service');

const { StatusCodes } = httpStatus;

const mountProfilejson = async (profile, user) => {
  log.info(`Montando json de retorno do profile do usuário. userId=${user.id}`);
  log.info(`Buscando endereço do usuário. userId=${user.id}`);

  const address = await addressService.getByUserId(user.id);

  if (!address) throw new Error('Endereço não encontrado');

  log.info(`Buscando foto de perfil. profileId=${profile.id}`);
  const picture = await profilePictureService.getByProfileId(profile.id);

  const bday = util.formatDate(user.birthday);
  let result = {};

  if (picture) result = { picture: picture.pictureUrl };

  result = {
    ...result,
    name: user.name,
    lastname: user.lastname,
    birthday: bday,
    gender: user.gender,
    ...profile.dataValues,
    address: {
      city: address.city,
      state: address.state,
    },
  };

  return result;
};

const create = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para criar um perfil.'
  /* #swagger.parameters['newProfile'] = {
          in: 'body',
          description: 'Informações do perfil.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/AddProfile" }
          } */
  /* #swagger.responses[201] = {
              schema: { $ref: "#/definitions/Profile" },
              description: 'Novo perfil criado.'
          } */
  try {
    const { body, user } = req;
    log.info(`Iniciando criação do perfil. userId=${user.id}`);

    const profileData = {
      userId: user.id,
      socialMedia: body.socialMedia,
      description: body.description,
      privateAtConnection: body.privateAtConnection,
    };

    log.info('Criando perfil no banco de dados');
    const newProfile = await profileService.create(profileData);
    const result = await mountProfilejson(newProfile, user);

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar perfil';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getProfileByUserId = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para buscar perfil.'
  /* #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Profile" },
            description: 'Perfil encontrado.'
        } */
  try {
    const { user } = req;

    log.info(`Iniciando busca pelo perfil. userId=${user.id}`);
    const profile = await profileService.getById(user.id);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Nenhum perfil foi encontrado' });
    }

    log.info(`Finalizando busca ao perfil. userId=${user.id}`);

    return res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    const errorMsg = 'Erro ao buscar perfil';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const edit = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para modificar um perfil.'
  /* #swagger.parameters['profile'] = {
          in: 'body',
          description: 'Informações do perfil.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/AddProfile" }
          } */
  /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/Profile" },
              description: 'Perfil editado.'
          } */
  try {
    const { body, user } = req;

    log.info(`Iniciando atualização do perfil. userId=${user.id}`);
    log.info('Verificando se o perfil existe');

    const existedProfile = await profileService.getById(user.id);

    if (!existedProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Endereço não encontrado' });
    }

    const profileData = {
      userId: user.id,
      socialMedia: body.socialMedia,
      description: body.description,
      privateAtConnection: body.privateAtConnection,
    };

    log.info(`Atualizando perfil no banco de dados. userId=${user.id}`);
    const profile = await profileService.edit(user.id, profileData);
    const result = await mountProfilejson(profile, user);

    log.info('Perfil atualizado com sucesso');
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar perfil';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const delet = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para exclui o perfil de um usuario.'
  /* #swagger.responses[200] = {
              schema: "Perfil excluido com sucesso",
              description: 'Perfil excluido.'
          } */

  try {
    const { user } = req;

    log.info(`Deletando perfil. userId=${user.id}`);
    await profileService.delet(user.id);

    return res.status(StatusCodes.OK).json('Perfil deletado com sucesso');
  } catch (error) {
    const errorMsg = 'Erro ao deletar perfil';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  getProfileByUserId,
  edit,
  delet,
};

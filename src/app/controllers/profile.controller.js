const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const userService = require('../services/user.service');
const profileService = require('../services/profile.service');
const addressService = require('../services/address.service');
const recomendationService = require('../services/recomendation.service');
const connectionRequestService = require('../services/connectionRequest.service');

const { StatusCodes } = httpStatus;

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
      headerImage: body.headerImage,
    };

    log.info('Criando perfil no banco de dados');
    const newProfile = await profileService.create(profileData, user);

    return res.status(StatusCodes.CREATED).json(newProfile);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar perfil';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getMyProfile = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para buscar todos os perfis.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Profile" },
            description: 'Perfil encontrado.'
        } */
  try {
    const { user } = req;

    log.info(`Iniciando busca pelo perfil. userId=${user.id}`);
    const profile = await profileService.getById(user);

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

const getAllProfile = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para buscar todos os perfis.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.responses[200] = {
            schema: { $ref: "#/definitions/PosterAll" },
            description: 'Anuncios encontrado.'
        } */
  try {
    const { query } = req;

    log.info('Iniciando busca pelos Perfis.');
    log.info('Buscando Perfis.');

    const posters = await profileService.getAll(query);

    log.info('Busca finalizada com sucesso');

    return res.status(StatusCodes.OK).json(posters);
  } catch (error) {
    const errorMsg = 'Erro ao buscar todos os anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getProfileByUserId = async (req, res) => {
  // #swagger.tags = ['Profile']
  // #swagger.description = 'Endpoint para user buscar perfil de outro usuario.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.responses[200] = {
            schema: { $ref: "#/definitions/OtherProfile" },
            description: 'Perfil encontrado.'
        } */
  try {
    const { userId } = req.params;

    log.info(`Iniciando busca pelo perfil de outro usuário. userId=${userId}`);
    log.info('Buscando se há conexão entre os usuários');

    const user = await userService.getById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    const connection = await connectionRequestService.getByUsers(
      req.user.id,
      userId,
    );
    const profile = await profileService.getByUserId(userId);

    let result = await profileService.getById(user);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Nenhum perfil foi encontrado' });
    }

    result = {
      connection,
      ...result,
    };

    log.info(`Finalizando busca ao perfil. userId=${userId}`);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao buscar perfil de outro usuário';

    log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getRecomendation = async (req, res) => {
  try {
    const { user } = req;

    log.info(`Iniciando recomedação de perfils. userId=${user.id}`);
    log.info(`Buscando perfil do usuário. userId=${user.id}`);

    const profile = await profileService.getById(user);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil do usuário não encontrado' });
    }

    const ids = recomendationService.getTagsIds(profile.tags);
    const amountTags = ids.length;

    let tagsSimilarity = {};
    let addressesSimilarity = {};
    let categoriesSimilarity = {};

    log.info(
      `Buscando a similaridade com o perfil de outros usuários a partir das tags. profileId=${profile.id}`,
    );

    if (amountTags > 0) {
      tagsSimilarity = await recomendationService.getTagsSimilarity(
        ids,
        profile.id,
        amountTags,
      );
    }

    log.info(`Buscando endereço do usuário. userId=${user.id}`);
    const address = await addressService.getByUserId(user.id);

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Endereço do usuário não encontrado' });
    }

    log.info(
      `Buscando a similaridade com o perfil de outros usuários a partir do endereço. userId=${user.id}`,
    );
    addressesSimilarity = await recomendationService.getAddressSimilarity(
      address,
    );

    log.info(
      `Buscando a similaridade com o perfil de outros usuários a partir das categorias. userId=${user.id}`,
    );

    if (amountTags > 0) {
      categoriesSimilarity = await recomendationService.getCategorySimilarity(
        profile.tags,
        profile.id,
      );
    }

    log.info('Calculando perfils mais similares');
    const profilesSimilarities = recomendationService.getProfileSimilarity(
      tagsSimilarity,
      addressesSimilarity,
      categoriesSimilarity,
    );

    const recomendation = await recomendationService.recomendationProfile(
      profilesSimilarities,
    );

    return res.status(StatusCodes.OK).json(recomendation);
  } catch (error) {
    const errorMsg = 'Erro ao buscar perfils recomendados';

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

    const existedProfile = await profileService.getByUserId(user.id);

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
      headerImage: body.headerImage,
    };

    log.info(`Atualizando perfil no banco de dados. userId=${user.id}`);
    const profile = await profileService.edit(user, profileData);

    log.info('Perfil atualizado com sucesso');
    return res.status(StatusCodes.OK).json(profile);
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
  getRecomendation,
  getMyProfile,
  getAllProfile,
  getProfileByUserId,
  edit,
  delet,
};

const httpStatus = require('http-status-codes');
const service = require('../services/poster.service');
const profileService = require('../services/profile.service');
const addressService = require('../services/address.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const makeResult = async (userId, poster) => {
  log.info(`Buscando endereço do usuário. userId=${userId}`);

  const address = await addressService.getByUserId(userId);

  if (!address) throw new Error('Usuário não possui endereço');

  const result = {
    ...poster.dataValues,
    owner: {
      id: userId,
      address,
    },
  };

  return result;
};

const isSameAddress = (address1, address2) => address1.street === address2.street
  && address1.number === address2.number
  && address1.district === address2.district
  && address1.zipCode === address2.zipCode
  && address1.city === address2.city
  && address1.state === address2.state;

const create = async (req, res) => {
  try {
    const { user, body } = req;

    log.info(`Inicializando fluxo de criação de anúncio. userId=${user.id}`);
    log.info(`Buscando algum anúncio vinculado ao usuário.userId=${user.id}`);

    const existedPoster = await service.getByUserId(user.id);

    if (existedPoster) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Usuário não pode ter mais de um anúncio' });
    }

    log.info(`Buscando perfil do usuário. userId=${user.id}`);
    const profile = await profileService.getByUserId(user.id);

    if (profile.posterId) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Usuário ja é residente em algum anúncio' });
    }

    const data = {
      userId: user.id,
      ...body,
    };

    log.info(`Criando anúncio no banco de dados.userId=${user.id}`);
    const poster = await service.create(data);

    log.info(
      `Adicionando perfil do usuário como residente. profileId=${profile.id}, posterId=${poster.id}`,
    );
    await profileService.addPosterId(profile, poster.id);

    const result = await makeResult(user.id, poster);

    log.info('Criação finalizada com sucesso');

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getMy = async (req, res) => {
  try {
    const { user } = req;

    log.info(
      `Iniciando busca pelo anúncio do usuário logado. userId=${user.id}`,
    );
    log.info(`Buscando anúncio. userId=${user.id}`);

    let myPoster = await service.getByUserId(user.id);

    if (!myPoster) {
      log.info(`Buscando perfil. userId=${user.id}`);

      const profile = await profileService.getByUserId(user.id);

      if (profile) {
        const { posterId } = profile;

        log.info(
          `Buscando anúncio em que o usuário seja residente. posterId=${posterId}`,
        );
        const poster = await service.getById(posterId);

        if (poster) myPoster = poster;
      }
    }

    if (!myPoster) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Esse usuário não tem nem é residente em algum anúncio',
      });
    }

    const result = await makeResult(user.id, myPoster);

    log.info('Busca finalizada com sucesso');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao pegar meu anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { posterId } = req.params;

    log.info(`Iniciando busca pelo anúncio. posterId=${posterId}`);
    log.info(`Buscando anúncio. posterId=${posterId}`);

    const poster = await service.getById(posterId);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anúncio não encontrado' });
    }

    const result = await makeResult(poster.userId, poster);

    log.info('Busca finalizada com sucesso');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao buscar um anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info('Iniciando busca pelos anúncios.');
    log.info('Buscando anúncios.');

    const posters = await service.getAll(query);

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

const edit = async (req, res) => {
  try {
    const { user, body } = req;

    log.info(`Iniciando atualização do anúncios. userId=${user.id}`);
    log.info(`Buscando anúncio. userId=${user.id}`);

    const poster = await service.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Esse usuário não possui nenhum anúncio' });
    }

    log.info(`Atualizando anúncio. posterId=${poster.id}`);
    const updatedPoster = await service.edit(poster.id, body);

    log.info('Atualização finalizada com sucesso');

    return res.status(StatusCodes.OK).json(updatedPoster);
  } catch (error) {
    const errorMsg = 'Erro ao editar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const delet = async (req, res) => {
  try {
    const { user } = req;

    log.info(`Iniciando remoção do anúncios. userId=${user.id}`);
    log.info(`Buscando anúncio. userId=${user.id}`);

    const poster = await service.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Esse usuário não possui nenhum anúncio' });
    }

    log.info(`Removendo anúncio. posterId=${poster.id}`);
    await service.delet(poster);

    log.info('Remoção finalizada com sucesso');

    return res.status(StatusCodes.OK).json('Anúncio deletado com sucesso');
  } catch (error) {
    const errorMsg = 'Erro ao deletar anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const addResident = async (req, res) => {
  try {
    const { user } = req;
    const { posterId, profileId } = req.params;

    log.info(`Iniciando adição de residente ao anúncio. userId=${user.id}`);
    log.info(`Buscando anúncio. posterId=${posterId}`);

    const poster = await service.getById(posterId);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anúncio não encontrado' });
    }

    if (poster.userId !== user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error:
          'Você não tem permissão para adicionar residentes a esse anúncio',
      });
    }

    log.info(`Buscando perfil. profileId=${profileId}`);

    const profile = await profileService.getByPk(profileId);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil não encontrado' });
    }

    if (profile.posterId) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Esse usuário já é residente em algum anúncio' });
    }

    log.info(
      `Buscando endereço. profileId=${profile.userId}, posterId=${poster.id}`,
    );

    const addressProfile = await addressService.getByUserId(profile.userId);
    const addressPoster = await addressService.getByUserId(poster.userId);

    if (!addressProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Endereço do usuário não encontrado' });
    }

    if (!addressPoster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Endereço do anúncio não encontrado' });
    }

    log.info(
      `Comparando endereços, addressPosterId=${addressPoster.id}, addressProfileId=${addressProfile.id}`,
    );

    if (!isSameAddress(addressPoster, addressProfile)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          'Usuários que não moram no mesmo endereço do anúncio não podem ser adicionados como residente do mesmo',
        );
    }

    await profileService.addPosterId(profile, posterId);
    const updatedPoster = await service.getById(posterId);
    const result = await makeResult(user.id, updatedPoster);

    log.info('Adição de residente realizada com sucesso.');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao adicionar um residente ao anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const removeResident = async (req, res) => {
  try {
    const { user } = req;
    const { posterId, profileId } = req.params;

    log.info(`Iniciando remoção de residente ao anúncio. userId=${user.id}`);
    log.info(`Buscando anúncio. posterId=${posterId}`);

    const poster = await service.getById(posterId);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anúncio não encontrado' });
    }

    if (poster.userId !== user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Você não tem permissão para remover residentes a esse anúncio',
      });
    }

    log.info(`Buscando perfil. profileId=${profileId}`);

    const profile = await profileService.getByPk(profileId);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil não encontrado' });
    }

    if (`${profile.posterId}` !== posterId) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Esse usuário não é residente deste anúncio' });
    }

    if (user.id === profile.userId) {
      return res.status(StatusCodes.CONFLICT).json({
        error: 'Você não pode se remover como residente de seu próprio anúncio',
      });
    }

    await profileService.removePosterId(profile);
    const updatedPoster = await service.getById(posterId);
    const result = await makeResult(user.id, updatedPoster);

    log.info('Remoção de residente realizada com sucesso.');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao remover um residente ao anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getResidents = async (req, res) => {
  try {
    const { user } = req;
    const { posterId } = req.params;

    log.info(`Iniciando busca de residentes do anúncio. userId=${user.id}`);
    log.info(`Buscando perfils. posterId=${posterId}`);

    const residents = await profileService.getResidents(posterId);

    log.info('Busca pelos residentes finalizada com sucesso');

    return res.status(StatusCodes.OK).json(residents);
  } catch (error) {
    const errorMsg = 'Erro ao remover um residente ao anúncio';

    log.error(errorMsg, 'app/controllers/poster.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  getMy,
  getById,
  getAll,
  edit,
  delet,
  addResident,
  removeResident,
  getResidents,
};

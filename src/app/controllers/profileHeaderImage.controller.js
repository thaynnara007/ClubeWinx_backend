const httpStatus = require('http-status-codes');
const service = require('../services/profileHeaderImage.service');
const profileService = require('../services/profile.service');
const firebaseService = require('../services/firebase.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const edit = async (req, res) => {
  try {
    const { user, file } = req;

    log.info(
      `Inicializando atualização da foto do cabeçalho do perfil do usuário. userId=${user.id}`,
    );
    log.info(`Buscando perfil do usuário logado. userId=${user.id}`);
    const profile = await profileService.getByUserId(user.id);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil não encontrado' });
    }

    const existedPicture = await service.getByProfileId(profile.id);

    log.info(`Fazendo upload da imagem. file=${file}`);
    const uploadPicture = await firebaseService.upload(file);

    let picture = null;
    if (!existedPicture) {
      log.info('Criando imagem no banco de dados');
      picture = await service.create(profile.id, uploadPicture);
    } else {
      log.info('Atualizando imagem no banco de dados');
      picture = await service.edit(profile.id, uploadPicture);
    }

    const result = {
      imageHeader: picture.pictureUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro atualizar foto de perfil';

    log.error(
      errorMsg,
      'app/controllers/profilePicture.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  edit,
};

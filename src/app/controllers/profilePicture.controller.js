const httpStatus = require('http-status-codes');
const profilePictureService = require('../services/profilePicture.service');
const profileService = require('../services/profile.service');
const firebaseService = require('../services/firebase.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const edit = async (req, res) => {
  try {
    const { user, file } = req;

    log.info(
      `Inicializando atualização da foto de perfil do usuário. userId=${user.id}`,
    );
    log.info(`Buscando perfil do usuário logado. userId=${user.id}`);
    const profile = await profileService.getByUserId(user.id);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil não encontrado' });
    }

    const existedPicture = await profilePictureService.getByProfileId(
      profile.id,
    );

    log.info(`Fazendo upload da imagem. file=${file}`);
    const uploadPicture = await firebaseService.upload(file);

    let picture = null;
    if (!existedPicture) {
      log.info('Criando imagem no banco de dados');
      picture = await profilePictureService.create(profile.id, uploadPicture);
    } else {
      log.info('Atualizando imagem no banco de dados');
      picture = await profilePictureService.edit(profile.id, uploadPicture);
    }

    const result = {
      picture: picture.pictureUrl,
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

const delet = async (req, res) => {
  try {
    const { user } = req;

    log.info(
      `Inicializando remoção da foto de perfil do usuário. userId=${user.id}`,
    );
    log.info(`Buscando perfil do usuário logado. userId=${user.id}`);

    const profile = await profileService.getByUserId(user.id);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Perfil não encontrado' });
    }

    const picture = await profilePictureService.getByProfileId(profile.id);

    if (!picture) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Foto de perfil não encontrada' });
    }

    const { imageName } = picture;

    log.info(`Deletando imagem do bando da dados. profileId=${profile.id}`);
    await profilePictureService.delet(picture);

    log.info(`Deletando imagem do firebase. imageName=${imageName}`);
    await firebaseService.delet(imageName);

    log.info('Remoção realizada com sucesso');

    return res.status(StatusCodes.OK).json('Foto apagada');
  } catch (error) {
    const errorMsg = 'Erro deletar foto de perfil';

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
  delet,
};

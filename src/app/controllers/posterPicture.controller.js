const httpStatus = require('http-status-codes');
const posterPictureService = require('../services/posterPicture.service');
const posterService = require('../services/poster.service');
const firebaseService = require('../services/firebase.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { user, file } = req;

    log.info(
      `Inicializando atualização da foto do anuncio do usuário. userId=${user.id}`,
    );
    log.info(`Buscando anuncio do usuário logado. userId=${user.id}`);
    const poster = await posterService.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anuncio não encontrado' });
    }

    const existedPictures = await posterPictureService.getByPosterId(poster.id);

    log.info(`Total de fotos do anuncio =${existedPictures.count}`);
    let picture = null;
    if (!existedPictures || existedPictures.count > 4) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Imagem não encontrado ou limite maximo atingido' });
    }
    log.info('Fazendo upload da imagem');
    const uploadPicture = await firebaseService.upload(file);
    log.info('criando imagem no banco de dados');
    picture = await posterPictureService.create(poster.id, uploadPicture);

    const result = {
      picture: picture.pictureUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro atualizar foto de poster';

    log.error(
      errorMsg,
      'app/controllers/posterPicture.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const delet = async (req, res) => {
  // #swagger.tags = ['PosterPicture']
  // #swagger.description = 'Endpoint para excluir a imagem de um anuncio.'
  // #swagger.security = [{ 'Bearer': [] }]
  try {
    const { user } = req;
    const { pictureId } = req.params;
    log.info(
      `Inicializando remoção da foto de poster do usuário. userId=${user.id}`,
    );
    log.info(`Buscando anuncio do usuário logado. userId=${user.id}`);

    const poster = await posterService.getByUserId(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'anuncio não encontrado' });
    }

    const existedPictures = await posterPictureService.getByPictureId(
      pictureId,
    );

    if (!existedPictures) {
      log.info(
        `A foto de id ${pictureId} não esta associada ao anuncio de id ${poster.id}`,
      );
    }

    if (existedPictures.posterId === poster.id) {
      log.info(
        `Deletando imagem do firebase. image_name=${existedPictures.image_name}`,
      );
      await firebaseService.delet(existedPictures.image_name);

      log.info(`Deletando imagem do bando da dados. posterId=${poster.id}`);
      await posterPictureService.delet(existedPictures);
    }

    log.info('Remoção realizada com sucesso');

    return res.status(StatusCodes.OK).json('Foto apagada');
  } catch (error) {
    const errorMsg = 'Erro deletar foto de poster';

    log.error(
      errorMsg,
      'app/controllers/posterPicture.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  delet,
};

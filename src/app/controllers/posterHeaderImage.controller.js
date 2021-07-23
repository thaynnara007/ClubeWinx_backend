const httpStatus = require('http-status-codes');
const service = require('../services/posterHeaderImage.service');
const posterService = require('../services/poster.service');
const firebaseService = require('../services/firebase.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const edit = async (req, res) => {
  try {
    const { user, file } = req;

    log.info(
      `Inicializando atualização da foto do cabeçalho do anúncio do usuário. userId=${user.id}`,
    );
    log.info(`Buscando anúncio do usuário logado. userId=${user.id}`);
    const poster = await posterService.getByUserIdMin(user.id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anúncio não encontrado' });
    }

    const existedPicture = await service.getByPosterId(poster.id);

    log.info(`Fazendo upload da imagem. file=${file}`);
    const uploadPicture = await firebaseService.upload(file);

    let picture = null;
    if (!existedPicture) {
      log.info('Criando imagem no banco de dados');
      picture = await service.create(poster.id, uploadPicture);
    } else {
      log.info('Atualizando imagem no banco de dados');
      picture = await service.edit(poster.id, uploadPicture);
    }

    const result = {
      imageHeader: picture.pictureUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro atualizar foto de anúncio';

    log.error(
      errorMsg,
      'app/controllers/posterHeaderImage.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getImageHeader = async (req, res) => {
  try {
    const { id } = req.user;

    log.info(
      `Inicializando busca pela foto de cabeçalho do anúncio do usuário. userId=${id}`,
    );
    log.info(`Buscando anúncio do usuário. userId=${id}`);
    const poster = await posterService.getByUserIdMin(id);

    if (!poster) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Anúncio não encontrado' });
    }

    log.info('Buscando imagem do cabeçalho do anúncio.');
    const image = await service.getByPosterId(poster.id);

    const result = {
      imageHeader: image.pictureUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro buscar imagem do caeçalho do anúncio';

    log.error(
      errorMsg,
      'app/controllers/posterHeaderImage.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  edit,
  getImageHeader,
};

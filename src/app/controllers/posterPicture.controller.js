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

    log.info(`Teste. userId=${existedPictures.count}`);
    log.info('Fazendo upload da imagem');
    let picture = null;
    if ( existedPictures.count > 4) {
      return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Imagem não encontrado' });
    } else {
      log.info('criando imagem no banco de dados');
      const uploadPicture = await firebaseService.upload(file);
      picture = await posterPictureService.create(poster.id, uploadPicture);
    }

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

// const edit = async (req, res) => {
//   try {
//     const { user, file } = req;
//     const { pictureId } = req.param;

//     log.info(
//       `Inicializando atualização da foto do anuncio do usuário. userId=${user.id}`,
//     );
//     log.info(`Buscando anuncio do usuário logado. userId=${user.id}`);
//     const poster = await posterService.getByUserId(user.id);

//     if (!poster) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ error: 'Anuncio não encontrado' });
//     }

//     const existedPicture = await posterPictureService.getByPictureId(poster.id, pictureId);

//     log.info('Fazendo upload da imagem');
//     const uploadPicture = await firebaseService.upload(file);

//     let picture = null;
//     if (!existedPicture) {
//       return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ error: 'Imagem não encontrado' });
//     } else {
//       log.info('Atualizando imagem no banco de dados');
//       picture = await posterPictureService.edit(poster.id, uploadPicture);
//     }

//     const result = {
//       picture: picture.pictureUrl,
//     };

//     return res.status(StatusCodes.OK).json(result);
//   } catch (error) {
//     const errorMsg = 'Erro atualizar foto de poster';

//     log.error(
//       errorMsg,
//       'app/controllers/posterPicture.controller.js',
//       error.message,
//     );

//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: `${errorMsg} ${error.message}` });
//   }
// };

const delet = async (req, res) => {
  try {
    const { user } = req;
    const { imgs } = req.body;
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

    await posterPictureService.delet(poster.id, imgs);

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
  // edit,
  delet,
};

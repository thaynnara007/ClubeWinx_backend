const { PosterPicture } = require('../models');
const firebaseService = require('../services/firebase.service');
const log = require('./log.service');

const getByPosterId = async (posterId) => {
  const picture = await PosterPicture.findAndCountAll({
    where: {
      posterId,
    },
  });

  return picture;
};

const getByPictureId = async (posterId, id) => {
  const picture = await PosterPicture.findOne({
    where: {
      posterId,
      id
    },
  });
  return picture;
}

const create = async (posterId, { fileName, token }) => {
  const data = {
    posterId,
    image_name: fileName,
    token,
  };

  const picture = await PosterPicture.create(data);

  return picture;
};

const edit = async (posterId, { fileName, token }) => {
  const data = {
    image_name: fileName,
    token,
  };

  await PosterPicture.update(data, {
    where: {
      posterId,
    },
  });

  return getByPosterId(posterId);
};

const deletImg = async (posterId, id) => {
  const picture = await PosterPicture.findOne({
    where: {
      posterId,
      id,
    },
  });

  if (!picture) {
    log.info(
      `A foto de id ${id} não esta associada ao anuncio de id ${posterId}`,
    );
  } 
  else {
    log.info(`Deletando imagem do bando da dados. posterId=${posterId}`);
    await picture.destroy();

    log.info(`Deletando imagem do firebase. image_name=${picture.image_name}`);
    await firebaseService.delet(picture);
  }
};

const delet = async (posterId, imageIds) => {
  await Promise.all(
    imageIds.map(async (imageId) => {
      await deletImg(posterId, imageId);
    }),
  );
};

module.exports = {
  getByPosterId,
  getByPictureId,
  create,
  edit,
  delet,
};

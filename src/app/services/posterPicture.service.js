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

const getByPictureId = async (pictureId) => {
  const picture = await PosterPicture.findOne({
    where: {
      id: pictureId,
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

const delet = async (picture) => {
    await picture.destroy();
};


module.exports = {
  getByPosterId,
  getByPictureId,
  create,
  edit,
  delet,
};

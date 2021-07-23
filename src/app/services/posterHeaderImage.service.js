const { PosterHeaderImage } = require('../models');

const getByPosterId = async (posterId) => {
  const picture = await PosterHeaderImage.findOne({
    where: {
      posterId,
    },
  });

  return picture;
};

const create = async (posterId, { fileName, token }) => {
  const data = {
    posterId,
    imageName: fileName,
    token,
  };

  const picture = await PosterHeaderImage.create(data);

  return picture;
};

const edit = async (posterId, { fileName, token }) => {
  const data = {
    imageName: fileName,
    token,
  };

  await PosterHeaderImage.update(data, {
    where: {
      posterId,
    },
  });

  return getByPosterId(posterId);
};

const delet = async (picture) => picture.destroy();

module.exports = {
  getByPosterId,
  create,
  edit,
  delet,
};

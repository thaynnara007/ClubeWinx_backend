const { ProfilePicture } = require('../models');

const getByProfileId = async (profileId) => {
  const picture = await ProfilePicture.findOne({
    where: {
      profileId,
    },
  });

  return picture;
};

const create = async (profileId, { fileName, token }) => {
  const data = {
    profileId,
    imageName: fileName,
    token,
  };

  const picture = await ProfilePicture.create(data);

  return picture;
};

const edit = async (profileId, { fileName, token }) => {
  const data = {
    imageName: fileName,
    token,
  };

  await ProfilePicture.update(data, {
    where: {
      profileId,
    },
  });

  return getByProfileId(profileId);
};

const delet = async (picture) => picture.destroy();

module.exports = {
  getByProfileId,
  create,
  edit,
  delet,
};

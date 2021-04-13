const { Profile } = require('../models');

const create = async (profileData) => {
  const profile = await Profile.create(profileData);

  return profile;
};

const getById = async (userId) => {
  const profile = await Profile.findOne({
    where: {
      userId,
    },
  });

  return profile;
};

const getByUserId = async (userId) => {
  const profile = await Profile.findOne({
    where: {
      userId,
    },
    attributes: {
      include: ["id", "userId"]
    }
  });

  return profile;
}

const edit = async (userId, profileData) => {
  await Profile.update(profileData, {
    where: {
      userId,
    },
  });

  return getById(userId);
};

const delet = async (userId) => {
  const profile = await getById(userId);

  if (!profile) throw new Error('Nenhum endereço encontrado para esse usuário');

  return profile.destroy();
};

module.exports = {
  create,
  getById,
  edit,
  delet,
  getByUserId
};

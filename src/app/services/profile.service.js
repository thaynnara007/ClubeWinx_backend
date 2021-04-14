const { Profile, Tag } = require('../models');
const log = require('./log.service');
const util = require('./util.service');
const addressService = require('./address.service');
const profilePictureService = require('./profilePicture.service');

const mountProfilejson = async (profile, user, privateInfo = true) => {
  log.info(`Montando json de retorno do profile do usuário. userId=${user.id}`);
  log.info(`Buscando endereço do usuário. userId=${user.id}`);

  const address = await addressService.getByUserId(user.id);

  if (!address) throw new Error('Endereço não encontrado');

  log.info(`Buscando foto de perfil. profileId=${profile.id}`);
  const picture = await profilePictureService.getByProfileId(profile.id);

  const bday = util.formatDate(user.birthday);
  let result = {};

  if (!privateInfo) {
    result = {
      ...result,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
  }

  if (picture) {
    result = {
      ...result,
      picture: picture.pictureUrl,
    };
  }

  result = {
    ...result,
    name: user.name,
    lastname: user.lastname,
    birthday: bday,
    gender: user.gender,
    ...profile.dataValues,
    address: {
      city: address.city,
      state: address.state,
    },
  };

  return result;
};

const getById = async (user, privateInfo = true) => {
  const profile = await Profile.findOne({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: Tag, as: 'tags' }, 'name', 'ASC']],
  });

  const result = await mountProfilejson(profile, user, privateInfo);

  return result;
};

const create = async (profileData, user) => {
  await Profile.create(profileData);

  return getById(user, false);
};

const getByUserId = async (userId) => {
  const profile = await Profile.findOne({
    where: {
      userId,
    },
  });

  return profile;
};

const edit = async (user, profileData) => {
  await Profile.update(profileData, {
    where: {
      userId: user.id,
    },
  });

  return getById(user, false);
};

const delet = async (userId) => {
  const profile = await getByUserId(userId);

  if (!profile) throw new Error('Nenhum endereço encontrado para esse usuário');

  return profile.destroy();
};

module.exports = {
  create,
  getById,
  edit,
  delet,
  getByUserId,
};

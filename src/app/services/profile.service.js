const {
  Profile, ProfilePicture, Tag, User,
} = require('../models');
const log = require('./log.service');
const util = require('./util.service');
const addressService = require('./address.service');
const profilePictureService = require('./profilePicture.service');

const mountProfilejson = async (profile, user) => {
  log.info(`Montando json de retorno do profile do usuário. userId=${user.id}`);

  log.info(`Buscando endereço do usuário. userId=${user.id}`);

  const address = await addressService.getByUserId(user.id);

  if (!address) throw new Error('Endereço não encontrado');

  log.info(`Buscando foto de perfil. profileId=${profile.id}`);
  const picture = await profilePictureService.getByProfileId(profile.id);

  const bday = util.formatDate(user.birthday);
  let result = {};

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
    phoneNumber: user.phoneNumber,
    email: user.email,
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

const getById = async (user) => {
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

  const result = await mountProfilejson(profile, user);

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

const getResidents = async (posterId) => {
  const options = {
    where: {
      posterId,
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: [
            'phoneNumber',
            'email',
            'passwordHash',
            'forgetPasswordCode',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      {
        model: ProfilePicture,
        as: 'picture',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: Tag, as: 'tags' }, 'name', 'ASC']],
  };

  const residents = await Profile.findAll(options);

  return residents;
};

const getByPk = async (id) => Profile.findOne({
  where: {
    id,
  },
});

const edit = async (user, profileData) => {
  await Profile.update(profileData, {
    where: {
      userId: user.id,
    },
  });

  return getById(user, false);
};

const addPosterId = async (profile, posterId) => {
  const myProfile = profile;

  myProfile.posterId = posterId;

  return myProfile.save();
};

const removePosterId = async (profile) => {
  const targetProfile = profile;

  targetProfile.posterId = null;

  return targetProfile.save();
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
  getResidents,
  addPosterId,
  removePosterId,
  getByPk,
};

const { Op } = require('sequelize');
const { Profile, ProfilePicture, Tag, User, Address } = require('../models');
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

const getResidents = async (ProfileId) => {
  const options = {
    where: {
      ProfileId,
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

const getByPk = async (id) =>
  Profile.findOne({
    where: {
      id,
    },
  });

const getSpecificProfiles = async (profilesIds) => {
  const options = {
    where: {
      id: {
        [Op.or]: profilesIds,
      },
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
        include: [
          {
            model: Address,
            as: 'address',
            attributes: {
              exclude: [
                'street',
                'number',
                'district',
                'complement',
                'zipCode',
                'createdAt',
                'updatedAt',
              ],
            },
          },
        ],
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

  const profiles = await Profile.findAll(options);

  return profiles;
};

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

const removeProfileId = async (profile) => {
  const targetProfile = profile;

  targetProfile.ProfileId = null;

  return targetProfile.save();
};

const delet = async (userId) => {
  const profile = await getByUserId(userId);

  if (!profile) throw new Error('Nenhum endereço encontrado para esse usuário');

  return profile.destroy();
};

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  const tags =
    query.tags !== null && query.tags !== undefined
      ? query.tags.map((tag) => parseInt(tag, 10))
      : null;

  let offset = null;
  let profilesFiltered = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null && tags !== null) {
    const optionsFilter = {
      include: [
        {
          model: Tag,
          as: 'tags',
          where: {
            id: {
              [Op.in]: tags,
            },
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    };

    const profiles = await Profile.findAll(optionsFilter);

    const profilesIds = profiles.map((profile) => profile.dataValues.id);

    let options = {
      where: {
        id: {
          [Op.or]: profilesIds,
        },
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
          include: [
            {
              model: Address,
              as: 'address',
              attributes: {
                exclude: [
                  'street',
                  'number',
                  'district',
                  'complement',
                  'zipCode',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
    };

    options = {
      ...options,
      limit: pageSize,
      offset,
      distinct: true,
    };

    profilesFiltered = await Profile.findAndCountAll(options);

    profilesFiltered.pages = Math.ceil(profilesFiltered.count / pageSize);
  } else if (offset !== null && tags === null) {
    let options = {
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
          include: [
            {
              model: Address,
              as: 'address',
              attributes: {
                exclude: [
                  'street',
                  'number',
                  'district',
                  'complement',
                  'zipCode',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
    };

    options = {
      ...options,
      limit: pageSize,
      offset,
      distinct: true,
    };
    profilesFiltered = await Profile.findAndCountAll(options);

    profilesFiltered.pages = Math.ceil(profilesFiltered.count / pageSize);
  } else if (offset === null && tags !== null) {
    const optionsFilter = {
      include: [
        {
          model: Tag,
          as: 'tags',
          where: {
            id: {
              [Op.in]: tags,
            },
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    };

    const profiles = await Profile.findAll(optionsFilter);

    const profileIds = profiles.map((profile) => profile.dataValues.id);

    const options = {
      where: {
        id: {
          [Op.or]: profileIds,
        },
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
          include: [
            {
              model: Address,
              as: 'address',
              attributes: {
                exclude: [
                  'street',
                  'number',
                  'district',
                  'complement',
                  'zipCode',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
    };

    profilesFiltered = await Profile.findAll(options);
  } else {
    const options = {
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
          include: [
            {
              model: Address,
              as: 'address',
              attributes: {
                exclude: [
                  'street',
                  'number',
                  'district',
                  'complement',
                  'zipCode',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
    };
    profilesFiltered = await Profile.findAll(options);
  }

  return profilesFiltered;
};

module.exports = {
  create,
  getById,
  edit,
  delet,
  getByUserId,
  getResidents,
  addPosterId,
  removeProfileId,
  getByPk,
  getSpecificProfiles,
  getAll,
};

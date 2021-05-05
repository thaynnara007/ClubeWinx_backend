const { Op } = require('sequelize');
const { 
  Address,
  User,
  Profile 
} = require('../models');

const create = async (addressData) => {
  const address = await Address.create(addressData);

  return address;
};

const getById = async () => {};

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let adress = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
    };
    adress = await Address.findAndCountAll(options);

    adress.pages = Math.ceil(adress.count / pageSize);
  } else {
    adress = await Address.findAll();
  }

  return adress;
};

const getByUserId = async (userId) => {
  const address = await Address.findOne({
    where: {
      userId,
    },
  });

  return address;
};

const edit = async (userId, addressData) => {
  await Address.update(addressData, {
    where: {
      userId,
    },
  });

  return getByUserId(userId);
};

const delet = async (userId) => {
  const address = await getByUserId(userId);

  if (!address) throw new Error('Nenhum endereço encontrado para esse usuário');

  return address.destroy();
};

const getProfilesWithAddress = async (city, state, userId) => {
  const result = Address.findAll({
    where: {
      [Op.or]: [
        { city : {
          [Op.iLike]: city
        }},
        { state: {
          [Op.iLike]: state
        }}
      ],
      userId: {
        [Op.not]: userId
      }
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: [
            'birthday', 
            'lastname', 
            'gender', 
            'phoneNumber',
            'email', 
            'passwordHash', 
            'forgetPasswordCode',
            'createdAt', 
            'updatedAt'
          ]
        },
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: {
              exclude: [
                'description',
                'privateAtConnection',
                'socialMedia',
                'posterId',
                'createdAt',
                'updatedAt'
              ]
            }
          }
        ]
      }
    ]
  })

  return result
}

module.exports = {
  create,
  getById,
  getAll,
  getByUserId,
  edit,
  delet,
  getProfilesWithAddress
};

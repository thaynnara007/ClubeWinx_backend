const { Op } = require('sequelize');
const {
  Poster,
  User,
  Address,
  Tag,
  PosterPicture,
  Profile,
} = require('../models');
const util = require('./util.service');

const getByUserId = async (userId) => {
  const poster = await Poster.findOne({
    where: {
      userId,
    },
    include: [
      {
        model: Profile,
        as: 'profiles',
        attributes: {
          exclude: [
            'userId',
            'posterId',
            'privateAtConnection',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: PosterPicture,
        as: 'posterPictures',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: Tag, as: 'tags' }, 'name', 'ASC']],
  });

  return poster;
};

const create = async (data) => {
  const poster = await Poster.create(data);

  return poster;
};

const getById = async (posterId) => {
  const poster = await Poster.findOne({
    where: {
      id: posterId,
    },
    include: [
      {
        model: Profile,
        as: 'profiles',
        attributes: {
          exclude: [
            'userId',
            'posterId',
            'privateAtConnection',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: PosterPicture,
        as: 'posterPictures',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: Tag, as: 'tags' }, 'name', 'ASC']],
  });

  return poster;
};

const filterOwner = (posters) => posters.filter((poster) => !!poster.owner);

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  const { 
    city, 
    state, 
    tagss,  
    district, 
    expense,
    expenseOp, 
    residents, 
    residentsOp, 
    vacancies, 
    vacanciesOp, 
    bathrooms, 
    bathroomsOp, 
    beds, 
    bedsOp, 
  } = query

  const tags = query.tags !== null && query.tags !== undefined
    ? query.tags.map((tag) => parseInt(tag, 10))
    : null;

  let offset = null;
  let posters = null;
  let where = {}
  let include = [
    {
      model: User,
      as: 'owner',
      attributes: {
        exclude: [
          'birthday',
          'email',
          'phoneNumber',
          'gender',
          'passwordHash',
          'forgetPasswordCode',
          'createdAt',
          'updatedAt',
        ],
      },
    },
    {
      model: PosterPicture,
      as: 'posterPictures',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ]

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (expense) {
    if (expenseOp === 'min')
      where = { expense: { [Op.gte] : parseInt(expense, 10) }}
    else
      where = { expense: { [Op.lte] : parseInt(expense, 10) }}
  } 

  if (residents) { 
    if (residentsOp === 'min')
      where = { ...where, residents: { [Op.gte] : parseInt(residents, 10) }}
    else
      where = { ...where, residents: { [Op.lte] : parseInt(residents, 10) }}
  }

  if (vacancies) {
    if (vacanciesOp === 'max')
      where = { ...where, vacancies: { [Op.lte] : parseInt(vacancies, 10) }}
    else 
      where = { ...where, vacancies: { [Op.gte] : parseInt(vacancies, 10) }}
  }

  if (bathrooms) {
    if (bathroomsOp === 'max' )
      where = { ...where, bathrooms: { [Op.lte] : parseInt(bathrooms, 10) }}
    else
      where = { ...where, bathrooms: { [Op.gte] : parseInt(bathrooms, 10) }}
  }

  if (beds) { 
    if (bedsOp === 'max')
      where = { ...where, beds: { [Op.lte] : parseInt(beds, 10) }}
    else
      where = { ...where, beds: { [Op.gte] : parseInt(beds, 10) }}
  }
  
  if (offset !== null && tags !== null) {
    const optionsFilter = {
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'birthday',
              'email',
              'phoneNumber',
              'gender',
              'passwordHash',
              'forgetPasswordCode',
              'createdAt',
              'updatedAt',
            ],
          },
        },
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

    const posterFiltered = await Poster.findAll(optionsFilter);

    if (posterFiltered.length === 0) posters = [];
    else {
      const posterIds = posterFiltered.map((poster) => poster.dataValues.id);
      let options = {
        where: {
          id: {
            [Op.or]: posterIds,
          },
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: {
              exclude: [
                'birthday',
                'email',
                'phoneNumber',
                'gender',
                'passwordHash',
                'forgetPasswordCode',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: Profile,
            as: 'profiles',
            attributes: {
              exclude: [
                'userId',
                'posterId',
                'privateAtConnection',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
          {
            model: PosterPicture,
            as: 'posterPictures',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      };

      options = {
        ...options,
        limit: pageSize,
        offset,
        distinct: true,
      };

      posters = await Poster.findAndCountAll(options);

      posters.pages = Math.ceil(posters.count / pageSize);
    }
  } else if (offset !== null && tags === null) {
    let options = {
      where,
      distinct: true,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'birthday',
              'email',
              'phoneNumber',
              'gender',
              'passwordHash',
              'forgetPasswordCode',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Profile,
          as: 'profiles',
          attributes: {
            exclude: [
              'userId',
              'posterId',
              'privateAtConnection',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Tag,
          as: 'tags',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: PosterPicture,
          as: 'posterPictures',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    };

    options = {
      ...options,
      limit: pageSize,
      offset,
    };

    posters = await Poster.findAndCountAll(options);

    posters.pages = Math.ceil(posters.count / pageSize);
  } else if (offset === null && tags !== null) {
    const optionsFilter = {
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'birthday',
              'email',
              'phoneNumber',
              'gender',
              'passwordHash',
              'forgetPasswordCode',
              'createdAt',
              'updatedAt',
            ],
          },
        },
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

    const posterFiltered = await Poster.findAll(optionsFilter);
    if (posterFiltered.length === 0) {
      posters = [];
    } else {
      const posterIds = posterFiltered.map((poster) => poster.dataValues.id);

      let options = {
        where: {
          id: {
            [Op.or]: posterIds,
          },
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: {
              exclude: [
                'birthday',
                'email',
                'phoneNumber',
                'gender',
                'passwordHash',
                'forgetPasswordCode',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: Profile,
            as: 'profiles',
            attributes: {
              exclude: [
                'userId',
                'posterId',
                'privateAtConnection',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
          {
            model: PosterPicture,
            as: 'posterPictures',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      };

      options = {
        ...options,
        distinct: true,
      };

      posters = await Poster.findAll(options);
    }
  } else {
    const options = {
      where,
      distinct: true,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'birthday',
              'email',
              'phoneNumber',
              'gender',
              'passwordHash',
              'forgetPasswordCode',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Profile,
          as: 'profiles',
          attributes: {
            exclude: [
              'userId',
              'posterId',
              'privateAtConnection',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Tag,
          as: 'tags',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: PosterPicture,
          as: 'posterPictures',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    };

    posters = await Poster.findAll(options);
  }

  return posters;
};

const edit = async (id, data) => {
  await Poster.update(data, {
    where: {
      id,
    },
  });

  return getById(id);
};

const delet = async (poster) => poster.destroy();

module.exports = {
  getByUserId,
  create,
  getById,
  getAll,
  edit,
  delet,
};

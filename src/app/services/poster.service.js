const { Op } = require('sequelize');
const {
  Poster,
  User,
  Address,
  Tag,
  PosterPicture,
  Profile,
} = require('../models');

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

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  const {
    city,
    state,
    tags,
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
  } = query;

  let includeTags = {
    model: Tag,
    as: 'tags',
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  };

  if (tags) {
    const tagsIds = Array.isArray(tags)
      ? tags.map((tag) => parseInt(tag, 10))
      : [parseInt(tags, 10)];

    includeTags = {
      ...includeTags,
      where: {
        id: {
          [Op.or]: tagsIds,
        },
      },
    };
  }

  let includeAddress = {
    model: Address,
    as: 'address',
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  };

  let whereAddress = {};

  if (city) {
    whereAddress = {
      city: {
        [Op.iRegexp]: `${city}`,
      },
    };
  }

  if (state) {
    whereAddress = {
      ...whereAddress,
      state: {
        [Op.iRegexp]: `${state}`,
      },
    };
  }

  if (district) {
    whereAddress = {
      ...whereAddress,
      district: {
        [Op.iRegexp]: `${district}`,
      },
    };
  }

  if (city || state || district) includeAddress = { ...includeAddress, where: whereAddress };

  let offset = null;
  let posters = null;
  let where = {};
  const include = [
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
      include: [includeAddress],
      distinct: true,
    },
    {
      model: PosterPicture,
      as: 'posterPictures',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      ...includeTags,
    },
  ];

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (expense) {
    if (expenseOp === 'min') where = { expense: { [Op.gte]: parseInt(expense, 10) } };
    else where = { expense: { [Op.lte]: parseInt(expense, 10) } };
  }

  if (residents) {
    if (residentsOp === 'min') where = { ...where, residents: { [Op.gte]: parseInt(residents, 10) } };
    else where = { ...where, residents: { [Op.lte]: parseInt(residents, 10) } };
  }

  if (vacancies) {
    if (vacanciesOp === 'max') where = { ...where, vacancies: { [Op.lte]: parseInt(vacancies, 10) } };
    else where = { ...where, vacancies: { [Op.gte]: parseInt(vacancies, 10) } };
  }

  if (bathrooms) {
    if (bathroomsOp === 'max') where = { ...where, bathrooms: { [Op.lte]: parseInt(bathrooms, 10) } };
    else where = { ...where, bathrooms: { [Op.gte]: parseInt(bathrooms, 10) } };
  }

  if (beds) {
    if (bedsOp === 'max') where = { ...where, beds: { [Op.lte]: parseInt(beds, 10) } };
    else where = { ...where, beds: { [Op.gte]: parseInt(beds, 10) } };
  }

  let filter = {
    where,
    include,
  };

  if (offset !== null) {
    filter = {
      ...filter,
      limit: pageSize,
      offset,
      distinct: true,
    };

    posters = await Poster.findAndCountAll(filter);

    posters.count = posters.rows.length;
    posters.pages = Math.ceil(posters.count / pageSize);
  } else {
    posters = await Poster.findAll(filter);
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

const { Poster, User, Address, Tag, PosterPicture } = require('../models');
const { Op } = require('sequelize');

const getByUserId = async (userId) => {
  const poster = await Poster.findOne({
    where: {
      userId,
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
        model: PosterPicture,
        as: 'posterPictures',
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
          ],
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
          exclude: [
            'createdAt',
            'updatedAt',
          ],
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
  const tags = query.tags.map( tag => parseInt(tag,10) );

  let offset = null;
  let posters = null;
  let optionsFilter = {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: {
          exclude: [
            'name',
            'lastname',
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
          }
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  };

  if (page && pageSize) offset = (page - 1) * pageSize;

  console.log("page5 ", page);
  console.log("pageSize5 ", pageSize);
  console.log("offset5 ", offset);
  console.log("tags5 ", tags);

  if (offset !== null && tags !== null) {
    
    posterFiltered = await Poster.findAll(optionsFilter);
    
    let posterIds = posterFiltered.map(poster => poster.dataValues.id);

    let options = {
      where: {
        id: {
          [Op.or]: posterIds,
        }
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'name',
              'lastname',
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
          include: {
            model: Address,
            as: 'address',
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
            exclude: [
              'createdAt',
              'updatedAt',
            ],
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

  } else {
    let options= {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: {
            exclude: [
              'name',
              'lastname',
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

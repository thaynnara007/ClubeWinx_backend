const { Poster, User, Address, Tag, PosterPicture } = require('../models');

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
  const tags = query.tags;

  let offset = null;
  let posters = null;
  let options = {
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
    // order: [
    //   ['name', 'ASC'],
    //   [{ model: Tag, as: 'tags' }, 'name', 'ASC'],
    // ],
  };

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    options = {
      ...options,
      limit: pageSize,
      offset,
      distinct: true,
    };
    posters = await Poster.findAndCountAll(options)
    ;

    var postersFiltered = posters.rows.filter(poster => filtertags(poster,tags));

    postersFiltered.pages = Math.ceil(posters.count / pageSize);
  } else {
    postersFiltered = await Poster.findAll(options);
  }

  return postersFiltered;
};

function filtertags(poster,tags){
  tagsPoster = poster.tags;
  for (let index = 0; index < tagsPoster.length; index++) {
    const tagPoster = tagsPoster[index];
    for (let index = 0; index < tags.length; index++) {
      const tag =  tags[index];
      if (tagPoster.id.toString() === tag) {
        return true;
      }
    }
  }
  return false;
}

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

const { PosterTag } = require('../models');
const tagService = require('./tag.service');
const log = require('./log.service');

const addTag = async (posterId, tagId) => {
  const data = {
    posterId,
    tagId,
  };

  const validation = await PosterTag.findOne({
    where: data,
  });''

  if (!validation) await PosterTag.create(data);
  else {
    log.info(
      `A tag de id ${tagId} já esta associada ao poster de id ${posterId}`,
    );
  }
};

const addTags = async (posterId, tagIds) => {
  await Promise.all(
    tagIds.map(async (tagId) => {
      const tag = await tagService.getById(tagId);

      if (!tag) log.info(`Tag de id ${tagId} não existe`);
      else await addTag(posterId, tagId);
    }),
  );
};


const deleteTag = async (posterId, tagId) => {
  const PosterTag = await PosterTag.findOne({
    where: {
      posterId,
      tagId,
    },
  });

  if (!PosterTag) {
    log.info(
      `A tag de id ${tagId} não esta associada ao poster de id ${posterId}`,
    );
  } else PosterTag.destroy();
};

const removeTags = async (posterId, tagIds) => {
  await Promise.all(
    tagIds.map(async (tagId) => {
      await deleteTag(posterId, tagId);
    }),
  );
};

module.exports = {
  addTags,
  removeTags,
};

const { ProfileTag } = require('../models');
const tagService = require('./tag.service');
const log = require('./log.service');
const { Op } = require('sequelize');

const addTag = async (profileId, tagId) => {
  const data = {
    profileId,
    tagId,
  };

  const validation = await ProfileTag.findOne({
    where: data,
  });

  if (!validation) await ProfileTag.create(data);
  else {
    log.info(
      `A tag de id ${tagId} já esta associada ao perfil de id ${profileId}`,
    );
  }
};

const addTags = async (profileId, tagIds) => {
  await Promise.all(
    tagIds.map(async (tagId) => {
      const tag = await tagService.getById(tagId);

      if (!tag) log.info(`Tag de id ${tagId} não existe`);
      else await addTag(profileId, tagId);
    }),
  );
};

const createTags = async (profileId, tags) => {
  await Promise.all(
    tags.map(async (tagInfo) => {
      let tag = await tagService.getByName(tagInfo.name);

      if (!tag) {
        log.info(`Criando tag ${tagInfo.name} no banco de dados`);
        tag = await tagService.create(tagInfo);
      }
      await addTag(profileId, tag.id);
    }),
  );
};

const deleteTag = async (profileId, tagId) => {
  const profileTag = await ProfileTag.findOne({
    where: {
      profileId,
      tagId,
    },
  });

  if (!profileTag) {
    log.info(
      `A tag de id ${tagId} não esta associada ao perfil de id ${profileId}`,
    );
  } else profileTag.destroy();
};

const removeTags = async (profileId, tagIds) => {
  await Promise.all(
    tagIds.map(async (tagId) => {
      await deleteTag(profileId, tagId);
    }),
  );
};

const getProfilesByTags = async (tagsIds, profileId) => {
  const profiles = await ProfileTag.findAll({
    where: {
      tagId: {
        [Op.or]: tagsIds
      },
      profileId: {
        [Op.not] : profileId
      }
    }
  })

  return profiles
}

module.exports = {
  addTags,
  createTags,
  removeTags,
  getProfilesByTags
};

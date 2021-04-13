const { ProfileTag } = require('../models')
const tagService = require('../services/tag.service')
const log = require('../services/log.service')

const addTag = async (profileId, tagId) => {
  const data = {
    profileId,
    tagId
  }

  const validation = await ProfileTag.findOne({
    where: data
  })

  if (!validation)
    await ProfileTag.create(data)
  else 
  log.info(`A tag de id ${tagId} já esta associada ao perfil de id ${profileId}`)
}

const addTags = async (profileId, tagIds) => {
  await Promise.all(
    tagIds.map( async (tagId) => {
      const tag = await tagService.getById(tagId)

      if (!tag) 
        log.info(`Tag de id ${tagId} não existe`)
      else
        await addTag(profileId, tagId)
    })
  )
}

const createTags = async (profileId, tags) => {
  await Promise.all(
    tags.map( async (tagInfo) => {
      let tag = await tagService.getByName(tagInfo.name)

      if (!tag) {
        log.info(`Criando tag ${tagInfo.name} no banco de dados`)
        tag = await tagService.create(tagInfo)
      }
      await addTag(profileId, tag.id)
    })
  )
}

module.exports = {
  addTags,
  createTags
}
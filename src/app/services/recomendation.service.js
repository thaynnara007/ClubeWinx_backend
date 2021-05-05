const tagProfileService = require('./tagProfile.service')
const addressService = require('./address.service')
const util = require('./util.service')

const getTagsIds = (tags) => {
  const ids = tags.map( tag => {
    return tag.id
  })

  return ids
}

const countAppear = (profileTags) => {
  const result = profileTags.reduce( (accumulator, profileTag) => {
    const { profileId } = profileTag

    if (!(profileId in accumulator)) 
      return { ...accumulator, [profileId]: { amount: 1 }}
    else {
      const amountNow = accumulator[profileId].amount + 1
      return { ...accumulator, [profileId]: { amount: amountNow }}
    }
  }, {})

  return result
}

const getTagsSimilarityPercent = (count, totalAmountTags) => {
  const profilesIds = Object.keys(count)

  const result = profilesIds.reduce( ( accumulator, profileId )=> {
    const { amount } = count[profileId]
    const percent = amount / totalAmountTags

    return { 
      ...accumulator, 
      [profileId]: { 
        amount, 
        similarity: percent.toFixed(util.RECOMENDATION_TRUNCATE)
      }
    }
  }, {})

  return result
}

const getAddressSimilarityPercent = (addresses, searchedCity, searchedState) => {
  const result = addresses.reduce( (accumulator, address) => {
    const { city, state } = address
    const profileId = address.user.profile.id

    let percent = 0
    const sameCity = city.toLowerCase() === searchedCity.toLowerCase()
    const sameState = state.toLowerCase() === searchedState.toLowerCase()

    if (sameCity) 
      percent += util.CITY_RELEVANCE
    if (sameState)
      percent += util.STATE_RELEVANCE

    return { 
      ...accumulator, 
      [profileId]: { city, state, similarity: percent } 
    } 
  }, {})

  return result
}

const getTagsSimilarity = async (tagsIds, profileId, amountTags) => {
  const profiles = await tagProfileService.getProfilesByTags(tagsIds, profileId)
  const countTags = countAppear(profiles)
  const tagsSimilarity = getTagsSimilarityPercent(countTags, amountTags)
  
  return tagsSimilarity
}

const getAddressSimilarity = async (address) => {
  const { userId, city, state } = address

  const addresses = await addressService.getProfilesWithAddress(city, state, userId)
  const addressSimilarity = getAddressSimilarityPercent(addresses, city, state)

  return addressSimilarity
}

module.exports = {
  getTagsIds,
  getTagsSimilarity,
  getAddressSimilarity
}
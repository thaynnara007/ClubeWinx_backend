/* eslint-disable max-len */
const tagProfileService = require('./tagProfile.service');
const categoryService = require('./category.service');
const addressService = require('./address.service');
const profileService = require('./profile.service');
const util = require('./util.service');

const getTagsIds = (tags) => {
  const ids = tags.map((tag) => tag.id);

  return ids;
};

const normalizeCategoriesSimilarityPercent = (
  allProfilesIds,
  similarityPercents,
) => {
  const result = allProfilesIds.reduce((accumulator, profileId) => {
    const similarity = similarityPercents[profileId];

    return {
      ...accumulator,
      [profileId]: {
        similarity: similarity
          ? similarity.toFixed(util.RECOMENDATION_TRUNCATE)
          : 0,
      },
    };
  }, {});

  return result;
};

const getCategoriesCount = (tags) => {
  const result = tags.reduce((accumulator, tag) => {
    const { categoryId } = tag;

    if (!(categoryId in accumulator)) return { ...accumulator, [categoryId]: { amount: 1 } };

    const amountNow = accumulator[categoryId].amount + 1;
    return { ...accumulator, [categoryId]: { amount: amountNow } };
  }, {});
  return result;
};

const countAppear = (profileTags) => {
  const result = profileTags.reduce((accumulator, profileTag) => {
    const { profileId } = profileTag;

    if (!(profileId in accumulator)) return { ...accumulator, [profileId]: { amount: 1 } };

    const amountNow = accumulator[profileId].amount + 1;
    return { ...accumulator, [profileId]: { amount: amountNow } };
  }, {});

  return result;
};

const getTagsSimilarityPercent = (count, totalAmountTags) => {
  const profilesIds = Object.keys(count);

  const result = profilesIds.reduce((accumulator, profileId) => {
    const { amount } = count[profileId];
    const percent = amount / totalAmountTags;

    return {
      ...accumulator,
      [profileId]: {
        amount,
        similarity: percent ? percent.toFixed(util.RECOMENDATION_TRUNCATE) : 0,
      },
    };
  }, {});

  return result;
};

const getAddressSimilarityPercent = (
  addresses,
  searchedCity,
  searchedState,
) => {
  const result = addresses.reduce((accumulator, address) => {
    const { city, state } = address;
    const profileId = address.user.profile.id;

    let percent = 0;
    const sameCity = city && searchedCity
      ? city.toLowerCase() === searchedCity.toLowerCase()
      : false;
    const sameState = state && searchedCity
      ? state.toLowerCase() === searchedState.toLowerCase()
      : false;

    if (sameCity) percent += util.CITY_RELEVANCE;
    if (sameState) percent += util.STATE_RELEVANCE;

    return {
      ...accumulator,
      [profileId]: { city, state, similarity: percent },
    };
  }, {});

  return result;
};

const getCategoriesRelevance = (categories) => {
  const result = categories.reduce((accumulator, category) => {
    const { id, tags } = category;
    const usedTags = tags.length;
    const relevance = 1 / usedTags;

    return {
      ...accumulator,
      [id]: {
        relevance: relevance
          ? relevance.toFixed(util.RECOMENDATION_TRUNCATE)
          : 0,
      },
    };
  }, {});

  return result;
};

const countProfilesByTagsinCategory = (categories) => {
  const countProfiles = {};
  const allProfilesIdsSet = new Set();

  categories.forEach((category) => {
    const categoryId = category.id;
    countProfiles[categoryId] = {};

    category.tags.forEach((tag) => {
      tag.profiles.forEach((profile) => {
        const { id } = profile;

        if (!(id in countProfiles[categoryId])) {
          countProfiles[categoryId][id] = 1;
          allProfilesIdsSet.add(id);
        } else countProfiles[categoryId][id] += 1;
      });
    });
  });

  const allProfilesIds = [...allProfilesIdsSet];

  return { countProfiles, allProfilesIds };
};

const getCategorySimilarityPercent = (
  categoriesIds,
  countProfiles,
  categoriesRelevances,
  categoriesUser,
  allProfilesIds,
) => {
  const result = {};

  categoriesIds.forEach((categoryId) => {
    allProfilesIds.forEach((profileId) => {
      const categoryRelevance = parseFloat(
        categoriesRelevances[categoryId].relevance,
      );
      const amountUserTagsInCategory = categoriesUser[categoryId].amount;
      const profilesInCategory = countProfiles[categoryId];

      if (profileId in profilesInCategory) {
        const amountProfileTagsInCategory = profilesInCategory[profileId];
        const similarity = amountProfileTagsInCategory / amountUserTagsInCategory;

        if (profileId in result) result[profileId] += similarity * categoryRelevance;
        else result[profileId] = similarity * categoryRelevance;
      }
    });
  });

  return result;
};

const getTagsSimilarity = async (tagsIds, profileId, amountTags) => {
  const profiles = await tagProfileService.getProfilesByTags(
    tagsIds,
    profileId,
  );

  const countTags = countAppear(profiles);
  const tagsSimilarity = getTagsSimilarityPercent(countTags, amountTags);

  return tagsSimilarity;
};

const getAddressSimilarity = async (address) => {
  const { userId, city, state } = address;

  const addresses = await addressService.getProfilesWithAddress(
    city,
    state,
    userId,
  );
  const addressSimilarity = getAddressSimilarityPercent(addresses, city, state);

  return addressSimilarity;
};

const getCategorySimilarity = async (tags, profileId) => {
  const categoriesUser = getCategoriesCount(tags);
  const categoriesUserIds = Object.keys(categoriesUser);

  const categoriesProfiles = await categoryService.getProfilesByCategories(
    categoriesUserIds,
    profileId,
  );

  const categoriesRelevances = getCategoriesRelevance(categoriesProfiles);
  const { countProfiles, allProfilesIds } = countProfilesByTagsinCategory(
    categoriesProfiles,
  );
  const categoriesSimilarity = getCategorySimilarityPercent(
    categoriesUserIds,
    countProfiles,
    categoriesRelevances,
    categoriesUser,
    allProfilesIds,
  );

  return normalizeCategoriesSimilarityPercent(
    allProfilesIds,
    categoriesSimilarity,
  );
};

const getProfileSimilarity = (
  tagsSimilarity,
  addressSimilarity,
  categoriesSimilarity,
) => {
  const profileSimilarity = {};
  const profilesIds = [];

  const tagsSimilarityProfilesIds = Object.keys(tagsSimilarity);
  const addressesSimilarityProfilesIds = Object.keys(addressSimilarity);
  const categoriesSimilarityProfilesIds = Object.keys(categoriesSimilarity);

  tagsSimilarityProfilesIds.forEach((profileId) => {
    const similarity = parseFloat(tagsSimilarity[profileId].similarity)
      * util.TAGS_SIMILARITY_RELEVANCE;

    profilesIds.push(parseInt(profileId, 10));
    profileSimilarity[profileId] = similarity;
  });

  addressesSimilarityProfilesIds.forEach((profileId) => {
    const similarity = addressSimilarity[profileId].similarity
      * util.ADDRESS_SIMILARITY_RELEVANCE;

    if (profileId in profileSimilarity) profileSimilarity[profileId] += similarity;
    else {
      profilesIds.push(parseInt(profileId, 10));
      profileSimilarity[profileId] = similarity;
    }
  });

  categoriesSimilarityProfilesIds.forEach((profileId) => {
    let similarity = parseFloat(categoriesSimilarity[profileId].similarity);

    if (similarity > 1) similarity = 1;

    similarity *= util.CATEGORY_SIMILARITY_RELVANCE;

    if (profileId in profileSimilarity) profileSimilarity[profileId] += similarity;
    else {
      profilesIds.push(parseInt(profileId, 10));
      profileSimilarity[profileId] = similarity;
    }
  });

  return { profileSimilarity, profilesIds };
};

const order = (entity1, entity2, profileSimilarity) => {
  const id1 = entity1.id;
  const id2 = entity2.id;

  return profileSimilarity[id2] - profileSimilarity[id1];
};

const recomendationProfile = async ({ profileSimilarity, profilesIds }) => {
  const profiles = await profileService.getSpecificProfiles(profilesIds);

  const sortedProfiles = profiles.sort((profile1, profile2) => order(profile1, profile2, profileSimilarity));

  return sortedProfiles;
};

module.exports = {
  getTagsIds,
  getTagsSimilarity,
  getAddressSimilarity,
  getCategorySimilarity,
  getProfileSimilarity,
  recomendationProfile,
};

// single barrel pattern for easier imports

export { displayLoading, hideLoading } from "./loading.js";
export {
  getLocationData,
  fetchCitiesData,
  getIntroFromWiki,
  getPopulationData,
  getDataFromStorage,
  getPopulationDataForTable,
  createInterestingFacts,
  insertFooter
} from "./utils.js";
export {
  updateIntro,
  updatePhoto,
  updatePopulation,
  updatePopTable,
} from "./updates.js";
export { updateStateEl, updateCitiesEl } from "./nav.js";

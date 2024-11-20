import {
  getDataFromStorage,
  getLocationData,
  fetchCitiesData,
  getIntroFromWiki,
  getPopulationData,
  displayLoading,
  hideLoading,
  updateIntro,
  updatePhoto,
  updateStateEl,
  updateCitiesEl,
  updatePopulation,
} from "./utils/index.js";

// Update state, city, and interesting facts
const updateContent = async () => {
  console.log("updateContent");
  let { initialData, citiesData } = getDataFromStorage();
  if (!initialData || !citiesData) {
    initialData = await getLocationData();
    citiesData = await fetchCitiesData(
      initialData.state.code,
      initialData.country.code
    );
    localStorage.setItem("initialData", JSON.stringify(initialData));
    localStorage.setItem("citiesData", JSON.stringify(citiesData));
  }

  const { capital, city1, city2 } = citiesData;

  // Nav update
  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

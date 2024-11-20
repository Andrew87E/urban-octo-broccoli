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

  let cityIntro = localStorage.getItem(city1.name);
  if (!cityIntro) {
    cityIntro = await getIntroFromWiki(initialData.state.name, city1.name);
    localStorage.setItem(city1.name, JSON.stringify(cityIntro));
  } else {
    cityIntro = JSON.parse(cityIntro);
  }

  // console.log(cityIntro.intro);
  updateIntro(cityIntro.intro);
  updatePhoto(cityIntro.photo);

  getPopulationData(city1.name, initialData.country.code).then((population) => {
    updatePopulation(population.toLocaleString());
  });
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

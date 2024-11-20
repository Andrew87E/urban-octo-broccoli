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

/**
 * This is our main function that updates the state, city, and interesting facts on the page.
 */
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

  // console.log(initialData.city, citiesData);

  const { capital, city1, city2 } = citiesData;

  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);

  let capitalIntro = localStorage.getItem(capital);
  if (!capitalIntro) {
    capitalIntro = await getIntroFromWiki(initialData.state.name, capital);
    localStorage.setItem(capital, JSON.stringify(capitalIntro));
  } else {
    capitalIntro = JSON.parse(capitalIntro);
  }

  updateIntro(capitalIntro.intro);
  updatePhoto(capitalIntro.photo);
  getPopulationData(capital, initialData.country.code).then((population) => {
    updatePopulation(population.toLocaleString());
  });
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

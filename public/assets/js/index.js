import {
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
  getDataFromStorage,
} from "./utils/index.js";

// Update state, city, and interesting facts
const updateContent = async () => {
  let { initialData, citiesData } = getDataFromStorage();
  if (!initialData || !citiesData) {
    initialData = await getLocationData();
    const currentCity = initialData.city;
    citiesData = await fetchCitiesData(
      initialData.state.code,
      initialData.country.code,
      currentCity
    );
    localStorage.setItem("initialData", JSON.stringify(initialData));
    localStorage.setItem("citiesData", JSON.stringify(citiesData));
  }

  const { capital, city1, city2 } = citiesData;

  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);

  // Fetch the intro and photo for the state from localStorage or the API if not available
  let stateIntro = localStorage.getItem(initialData.state.name);
  if (!stateIntro) {
    stateIntro = await getIntroFromWiki(initialData.state.name);
    localStorage.setItem(initialData.state.name, JSON.stringify(stateIntro));
  } else {
    stateIntro = JSON.parse(stateIntro);
  }

  updateIntro(stateIntro.intro);
  updatePhoto(stateIntro.photo);

  getPopulationData(initialData.state.name, initialData.country.code).then(
    (population) => {
      $("#population-count").text(population.toLocaleString());
    }
  );
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

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

  // console.log(initialData, citiesData);
  localStorage.setItem("initialData", JSON.stringify(initialData));

  const { capital, city1, city2 } = citiesData;

  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);

  const stateIntro = await getIntroFromWiki(initialData.state.name);

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

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
  getPopulationDataForTable,
  createInterestingFacts,
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

  const city1 = citiesData.city1;
  const city2 = citiesData.city2;
  const capital = citiesData.capital;

  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);

  const capitalIntro = await getIntroFromWiki(
    initialData.state.name,
    citiesData.capital,
    true
  );
  updateIntro(capitalIntro.intro);
  updatePhoto(capitalIntro.photo);

  getPopulationData(capital, initialData.country.code).then((population) => {
    updatePopulation(population.toLocaleString());
  });

  await createInterestingFacts(capital, initialData.country.code, false);

  // Fetch population data for the table
  getPopulationDataForTable(
    initialData.state.name,
    initialData.country.code
  ).then((population) => {
    if (typeof population === "string" && population.includes("Error")) {
      $("#population-count").addClass("text-danger");
      console.error(
        population +
          " Please use our form to update this information! Thank you!"
      );
    } else {
      const geoNames = population.geonames; // array of population data
      //console.log(geoNames);
      let tableData = "";

      geoNames.forEach((city) => {
        if (city.name === initialData.state.name) {
          return;
        }

        tableData += `<tr>
            <td>${city.name}</td>
            <td>${city.population.toLocaleString()}</td>
            <td>${city.lat}, ${city.lng}</td>
          </tr>`;
      });
      $("#population-table-body").html(tableData);
    }
  });
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

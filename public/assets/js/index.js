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
  getPopulationDataForTable,
  createInterestingFacts,
} from "./utils/index.js";

// Update state, city, and interesting facts
const updateContent = async () => {
  const initialData = await getLocationData();
  const citiesData = await fetchCitiesData(
    initialData.state.code,
    initialData.country.code
  );

  // console.log(initialData, citiesData);
  localStorage.setItem("initialData", JSON.stringify(initialData));

  const { capital, top10 } = citiesData;
  const currentCity = initialData.city;

  // Filter out any duplicates: the capital and the user's current city
  const filteredCities = top10.filter(
    (city) => city.name !== capital && city.name !== currentCity
  );

  // Set city1 based on whether the current city is the capital
  let city1;
  if (currentCity === capital) {
    // If the user is in the capital, use the first city from the filtered list
    city1 = filteredCities[0];
  } else {
    // If the user is not in the capital, set city1 to the capital
    city1 = { name: currentCity };
  }

  // Select city2 as the next distinct city from filteredCities that isn't city1
  const city2 = filteredCities.find((city) => city.name !== city1.name) || {
    name: "Another city not available",
  }; // Fallback if list is too short

  // Store distinct cities in localStorage for later use
  localStorage.setItem("citiesData", JSON.stringify({ capital, city1, city2 }));

  // Log final result for debugging
  // console.log({ capitalCity: capital, city1: city1.name, city2: city2.name });
  // console.log({
  // city1: city1.name,
  // city2: city2.name,
  // capitalCity: capital,
  // });

  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);

  const stateIntro = await getIntroFromWiki(initialData.state.name);

  updateIntro(stateIntro.intro);
  updatePhoto(stateIntro.photo);

  getPopulationData(initialData.state.name, initialData.country.code).then(
    (population) => {
      const city1PopulationEl = document.getElementById("population-count");
      city1PopulationEl.textContent = population.toLocaleString();
    }
  );

  localStorage.setItem("stateIntroPhoto", JSON.stringify(stateIntro.photo));

  await createInterestingFacts(initialData.state.name, initialData.country.code, true);

  // update our table with the population data
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
        tableData += `
        <tr>
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

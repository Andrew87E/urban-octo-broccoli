const GEONAMES_USERNAME = "secret8squirrel";

// Fetch user's public IP address
const getIp = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};

const getLocatoinData = async () => {
  const ip = await getIp();
  const response = await fetch(
    `https://api.findip.net/${ip}/?token=85047163909943138b5593dc41e0512c`
  );
  const data = await response.json();

  return {
    country: { name: data.country.names.en, code: data.country.iso_code },
    state: {
      name: data.subdivisions[0].names.en,
      code: data.subdivisions[0].iso_code,
    },
    city: data.city.names.en,
    location: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  };
};

// Fetch the capital city of a given state using GeoNames API
const getCapitalCity = async (stateCode, countryCode) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
    );
    data = await response.json();
  }
  return data.geonames[0]?.toponymName;
};

// Fetch the top most populated city of a given state using GeoNames API
const getTop10Cities = async (stateCode, countryCode) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&adminCode1=${stateCode}&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
    );
    data = await response.json();
  }
  return data.geonames;
};

// fetch city data
const fetchCities = async (stateCode, countryCode) => {
  const capitalCity = await getCapitalCity(stateCode, countryCode);
  const top10 = await getTop10Cities(stateCode, countryCode);

  return {
    capital: capitalCity,
    top10: top10,
  };
};

const getStateIntro = async (state) => {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${state}`
  );
  const data = await response.json();
  console.log(data.extract); // Log for debugging
  return { intro: data.extract, photo: data.originalimage.source };
};

// Fetch population for a specific city using GeoNames API
const getStatePopulation = async (stateName, countryCode) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?q=${stateName}&country=${countryCode}&maxRows=1&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  return data.geonames[0]?.population || "Population data not available";
};

// Update state, city, and interesting facts
const updateContent = async () => {
  const initialData = await getLocatoinData();
  const citiesData = await fetchCities(
    initialData.state.code,
    initialData.country.code
  );

  console.log(initialData, citiesData);
  localStorage.setItem("initialData", JSON.stringify(initialData));

  const { capital, top10 } = citiesData;
  const currentCity = initialData.city;

  // Filter out the capital and the user's current city to avoid duplicates
  const filteredCities = top10.filter(
    (city) => city.name !== capital && city.name !== currentCity
  );

  // Set city1 to the capital if the user is not in the capital; otherwise, take the first city from filteredCities
  const city1 = currentCity === capital ? filteredCities[0] : { name: capital };

  // Set city2 to the first city in filteredCities that's not equal to city1
  const city2 = filteredCities.find((city) => city.name !== city1.name);
  localStorage.setItem("citiesData", JSON.stringify({ city1, city2, capital }));

  console.log({
    city1: city1.name,
    city2: city2.name,
    capitalCity: capital,
  });

  updateState(initialData.state.name);
  updateCities(city1.name, city2.name, capital);

  const stateIntro = await getStateIntro(initialData.state.name);
  updateStateIntro(stateIntro.intro);
  updatePhoto(stateIntro.photo);

  getStatePopulation(initialData.state.name, initialData.country.code).then(
    (population) => {
      const city1PopulationEl = document.getElementById("population-count");
      city1PopulationEl.textContent = population.toLocaleString();
    }
  );
};

const updatePhoto = async (photo) => {
  const photoEl = document.getElementById("state-pic");
  photo = photo.replace(/ /g, "_");
  photoEl.src = photo;
};

const updateStateIntro = async (stateIntro) => {
  const stateIntroEl = document.getElementById("state-intro");
  stateIntroEl.textContent = stateIntro;
};

const updateState = (state) => {
  const stateElements = document.querySelectorAll(".state-name");
  if (stateElements.length === 0) {
    console.error("No elements with class 'state-name' found.");
    return;
  }

  stateElements.forEach((element) => {
    element.textContent = state;
  });
  console.log("State updated");
};

const updateCities = (city1, city2, capital) => {
  const city1Element = document.getElementById("city-1");
  const city2Element = document.getElementById("city-2");
  const capitalElement = document.getElementById("capital-city");

  city1Element.textContent = city1;
  city2Element.textContent = city2;
  capitalElement.textContent = capital;
};

// Display loading animation
const displayLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "block";
};

// Hide loading animation
const hideLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

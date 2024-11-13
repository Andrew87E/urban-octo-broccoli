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
  // console.log({
  //   country: data.country.names.en,
  //   state: {
  //     name: data.subdivisions[0].names.en,
  //     code: data.subdivisions[0].iso_code,
  //   },
  //   city: data.city.names.en,
  //   location: {
  //     latitude: data.location.latitude,
  //     longitude: data.location.longitude,
  //   },
  // });
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
  const data = await response.json();
  return data.geonames[0]?.toponymName;
};

// Fetch the top most populated city of a given state using GeoNames API
const getTop10Cities = async (stateCode, countryCode) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&adminCode1=${stateCode}&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
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
// const getCityPopulation = async (cityName, countryCode) => {
//   const response = await fetch(
//     `http://api.geonames.org/searchJSON?q=${cityName}&country=${countryCode}&maxRows=1&username=${GEONAMES_USERNAME}`
//   );
//   const data = await response.json();
//   return data.geonames[0]?.population || "Population data not available";
// };

// Update state, city, and interesting facts
// Update state, city, and interesting facts
const updateContent = async () => {
  const initialData = await getLocatoinData();
  const citiesData = await fetchCities(
    initialData.state.code,
    initialData.country.code
  );

  console.log(initialData, citiesData);

  const city1Name = initialData.city;
  const city2 = citiesData.top10.find((city) => city.name !== initialData.city);

  updateState(initialData.state.name);
  updateCities(city1Name, city2.name, citiesData.capital);

  const stateIntro = await getStateIntro(initialData.state.name); // Await state intro text
  updateStateIntro(stateIntro.intro);
  updatePhoto(stateIntro.photo);
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
  // find all occurrences of the word "[State Name]" in the document
  const stateElement = document.getElementById("state-name");
  stateElement.textContent = state;
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

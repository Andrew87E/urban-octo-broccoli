const GEONAMES_USERNAME = "secret8squirrel";

// Fetch user's public IP address
const getIp = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};

const getLocationData = () => {
  const initialData = localStorage.getItem("initialData");
  const citiesData = localStorage.getItem("citiesData");

  if (initialData && citiesData) {
    console.log("Data found in local storage");
    console.log(JSON.parse(initialData).city);
    const initialDataParsed = JSON.parse(initialData);
    const citiesDataParsed = JSON.parse(citiesData);
    return { initialData: initialDataParsed, citiesData: citiesDataParsed };
  } else {
    // push to the home page
    window.location.href = "/";
  }
};

const getCityIntro = async (city, state) => {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
  );
  const data = await response.json();
  console.log(data.extract); // Log for debugging
  if (data.extract.includes("refers to:")) {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${city},${state}`
    );
    const data = await response.json();
    console.log(data.extract); // Log for debugging
    if (data.extract.includes("refers to:")) {
      return {
        intro: "No data available",
        photo:
          "https://media.istockphoto.com/id/483724081/photo/yosemite-valley-landscape-and-river-california.jpg?s=2048x2048&w=is&k=20&c=j0OSpP2sAz582wDP0t28BzmwSMb0BJ2li7koJ2yROcA=",
      };
    }
    return { intro: data.extract, photo: data.originalimage.source };
  }
  return { intro: data.extract, photo: data.originalimage.source };
};

// Fetch population for a specific city using GeoNames API
const getCityPopulation = async (cityName, countryCode) => {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?q=${cityName}&country=${countryCode}&maxRows=1&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  console.log(JSON.stringify(data));
  return data.geonames[0]?.population || "Population data not available";
};

// Update state, city, and interesting facts
const updateContent = async () => {
  const { initialData, citiesData } = getLocationData();

  console.log(initialData.city, citiesData);

  const city1 = citiesData.city1;
  const city2 = citiesData.city2;
  const capital = citiesData.capital;

  updateState(initialData.state.name);
  updateCities(city1.name, city2.name, capital);
  console.log(citiesData.capital);

  const cityIntro = await getCityIntro(
    citiesData.city1.name,
    initialData.state.name
  );
  updateCityIntro(cityIntro.intro);
  updatePhoto(cityIntro.photo);
  getCityPopulation(capital, initialData.country.code).then((population) => {
    const city1PopulationEl = document.getElementById("population-count");
    city1PopulationEl.textContent = population.toLocaleString();
  });
};

const updatePhoto = async (photo) => {
  const photoEl = document.getElementById("city-pic");
  photo = photo.replace(/ /g, "_");
  photoEl.src = photo;
};

const updateCityIntro = async (intro) => {
  const stateIntroEl = document.getElementById("city-intro");
  stateIntroEl.textContent = intro;
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
  const city1Element = document.querySelectorAll(".city-1");
  const city2Element = document.getElementById("city-2");
  const capitalEls = document.querySelectorAll(".capital-name");

  city1Element.forEach((element) => {
    element.textContent = city1;
  });
  city2Element.textContent = city2;
  capitalEls.forEach((element) => {
    element.textContent = capital;
  });
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

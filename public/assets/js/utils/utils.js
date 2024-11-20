const GEONAMES_USERNAME = "secret8squirrel";
let ipAdd;
let locationData;

import { updateLoadingText } from "./loading.js";

// Fetch user's public IP address
const getIp = async () => {
  updateLoadingText("Fetching IP address...");
  if (ipAdd) return ipAdd;
  const response = await fetch("https://www.andrewedwards.dev/api/test/feip");
  const data = await response.json();
  console.log(data);
  ipAdd = data.ipAdd;
  return ipAdd;
};

// get the city and state of the user using the IP address
export const getLocationData = async () => {
  updateLoadingText("Fetching location data...");
  if (locationData) return locationData;

  const ip = await getIp();
  const response = await fetch(
    `https://api.findip.net/${ip}/?token=85047163909943138b5593dc41e0512c`
  );
  const data = await response.json();

  locationData = data;

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
  updateLoadingText("Fetching capital city for your state...");
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?country=${countryCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
    );
    data = await response.json();
  }
  return data.geonames[0]?.toponymName;
};

// Fetch the top most populated city of a given state using GeoNames API
const getTop10Cities = async (stateCode, countryCode) => {
  updateLoadingText("Fetching the coolest cities for your state...");
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&adminCode1=${stateCode}&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
    );
    data = await response.json();
  }
  return data.geonames;
};

// fetch city data
export const fetchCitiesData = async (stateCode, countryCode, currentCity) => {
  updateLoadingText("Fetching city data for your state...");
  const capital = await getCapitalCity(stateCode, countryCode);
  const top10 = await getTop10Cities(stateCode, countryCode);

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

  return {
    capital,
    city1,
    city2,
  };
};

const insertFooter = async (state) => {
  // updateLoadingText("Putting socks on...");
  // text--code for heart in html  &#10084;
  const currentYear = new Date().getFullYear();
  const footer = `
    <p>&copy; ${currentYear} ${state} Government Office</p>
    <p id="subtext">Powered by <a href="https://www.geonames.org/" target="_blank">GeoNames</a> and <a href="https://www.wikipedia.org/" target="_blank">Wikipedia</a></p>
    <p id="small-subtext">Made with <a href="https://www.edwards.codes/" target="_blank" style="color: #e81324;">&#10084;</a> by <a href="https://www.github.com/andrew87e" target="_blank" style="color: #42f566;">Andrew Edwards</a></p>
  `;
  $("#footer").html(footer);
};

// Fetch introduction and image from Wikipedia API response
export const getIntroFromWiki = async (state, city, isCity) => {
  updateLoadingText("Fetching interesting facts...");
  insertFooter(state);
  const searchQuery = isCity ? `${city}, ${state}` : state;
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${encodeURIComponent(
    searchQuery
  )}&origin=*&pithumbsize=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const pageData = pages[pageId];

    // Use the extract as the intro
    let intro = pageData.extract;

    if (!intro) {
      // if city, state doesnt work lets try just the city.
      const newUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&titles=${encodeURIComponent(
        city
      )}&origin=*&pithumbsize=1000`;

      const newResponse = await fetch(newUrl);
      const newData = await newResponse.json();
      const newPages = newData.query.pages;
      const newPageId = Object.keys(newPages)[0];
      const newPageData = newPages[newPageId];
      intro = newPageData.extract;

      if (!intro) {
        intro = "No information found.";
      }

      return { intro, photo: newPageData.thumbnail.source ?? null };
    }
    // turn our string back into html
    const html = cleanHTML(intro);
    // set the intro to the cleaned html

    // Derive the full image source from the thumbnail URL, if available
    let photo = null;
    if (pageData.thumbnail.source) {
      // console.log(pageData.thumbnail.source);
      photo = pageData.thumbnail.source;
    }

    console.log({
      intro: html,
      photo,
    });

    return { intro: html, photo };
  } catch (error) {
    console.error("Error fetching data from Wikipedia:", error);
    return {
      intro: `
        <strong>We Couldn't find any info on this city! Please use our form to let us know! Thank you!</strong>
        <br><br>Laborum et elit ut elit eiusmod ipsum ad tempor exercitation sint. Exercitation mollit pariatur elit elit esse occaecat nisi ut culpa aute ipsum tempor mollit. Incididunt occaecat aliqua adipisicing culpa id et tempor eu velit. Aliquip officia ad ipsum duis et eu fugiat in incididunt esse tempor ipsum. In sint sunt commodo deserunt sit in qui cillum duis in mollit officia. Consequat eu anim in mollit reprehenderit esse sit dolor id reprehenderit. Lorem do aliqua id minim consectetur consectetur ea in non sunt proident nulla pariatur ex.`,
      photo:
        "https://images.unsplash.com/photo-1731331323996-7ff41939ddf3?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
  }
};

// Helper function to clean unwanted HTML tags
const cleanHTML = (htmlString) => {
  updateLoadingText("Cleaning up the text...");
  // Parse the HTML string into a document
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove unwanted tags (e.g., <link>, <style>)
  doc.querySelectorAll("link, style, script").forEach((el) => el.remove());

  // Return the cleaned HTML as a string
  return doc.body.innerHTML;
};

// Fetch population for a specific city using GeoNames API
export const getPopulationData = async (locationName, countryCode) => {
  updateLoadingText("Fetching population data...");
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?q=${locationName}&country=${countryCode}&maxRows=1&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  return (
    data.geonames[0]?.population ||
    "Population data not available. Please use our form to update this information! Thank you!"
  );
};

export const getDataFromStorage = () => {
  const initialData = JSON.parse(localStorage.getItem("initialData"));
  const citiesData = JSON.parse(localStorage.getItem("citiesData"));
  return { initialData, citiesData };
};

const GEONAMES_USERNAME = "secret8squirrel";
let ip;
let locationData;

// Fetch user's public IP address
const getIp = async () => {
  if (ip) return ip;
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  ip = data.ip;
  return data.ip;
};

// get the city and state of the user using the IP address
export const getLocationData = async () => {
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
export const fetchCitiesData = async (stateCode, countryCode) => {
  const capitalCity = await getCapitalCity(stateCode, countryCode);
  const top10 = await getTop10Cities(stateCode, countryCode);

  return {
    capital: capitalCity,
    top10: top10,
  };
};

const insertFooter = async (state) => {
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
  insertFooter(state);
  const searchQuery = isCity ? `${city}, ${state}` : state;
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${encodeURIComponent(
    searchQuery
  )}&origin=*&pithumbsize=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();
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

    // console.log({
    //   intro: html,
    //   photo,
    // });

    return { intro: html, photo };
  } catch (error) {
    console.error("Error fetching data from Wikipedia:", error);
    return {
      intro: "An error occurred while fetching information.",
      photo: null,
    };
  }
};

// Helper function to clean unwanted HTML tags
const cleanHTML = (htmlString) => {
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

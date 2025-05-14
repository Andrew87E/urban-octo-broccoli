/**
 * API interaction utilities
 */

import { API_CONFIG, STORAGE_KEYS } from "../config.js";
import {
  insertFooter,
  showSalaryError,
  updateSalaryComparison,
} from "./dom.js";

let cachedIp = null;

/**
 * Fetch user's public IP address
 * @returns {Promise<string>} User's IP address
 */
const getIp = async () => {
  try {
    if (cachedIp) return cachedIp;

    const response = await fetch(`${API_CONFIG.GEO_API_BASE}/feip`);
    if (!response.ok) throw new Error("Failed to fetch IP address");

    const data = await response.json();
    cachedIp = data.ipAdd;
    return cachedIp;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    throw error;
  }
};

/**
 * Get the city and state of the user using their IP address
 * @returns {Promise<Object>} Location data including country, state, city, and coordinates
 */
export const getLocationData = async () => {
  try {
    const ip = await getIp();
    const response = await fetch(`${API_CONFIG.GEO_API_BASE}/geoip?ip=${ip}`);
    if (!response.ok) throw new Error("Failed to fetch location data");

    const data = await response.json();

    return {
      country: {
        name: data.country.names.en,
        code: data.country.iso_code,
      },
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
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
};

/**
 * Fetch the capital city of a given state using GeoNames API
 * @param {string} stateCode - State code (e.g., TX)
 * @param {string} countryCode - Country code (e.g., US)
 * @returns {Promise<string>} Capital city name or empty string on error
 */
const getCapitalCity = async (stateCode, countryCode) => {
  try {
    console.log(`Fetching capital city for ${stateCode}, ${countryCode}`);

    // First try to get state capital
    let url = `${API_CONFIG.GEONAMES_API_BASE}/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=PPLA&maxRows=1&username=${API_CONFIG.GEONAMES_USERNAME}`;
    console.log(`Fetching from URL: ${url}`);

    let response = await fetch(url);
    let data = await response.json();

    // If no capital is found for the state, try country capital
    if (!data.geonames || data.geonames.length === 0) {
      console.log("No capital found for state, trying country capital");

      url = `${API_CONFIG.GEONAMES_API_BASE}/searchJSON?country=${countryCode}&featureCode=PPLA&maxRows=1&username=${API_CONFIG.GEONAMES_USERNAME}`;
      console.log(`Fetching from URL: ${url}`);

      response = await fetch(url);
      data = await response.json();
    }

    console.log("Capital city data:", data.geonames);

    if (
      data.geonames &&
      data.geonames.length > 0 &&
      data.geonames[0].toponymName
    ) {
      return data.geonames[0].toponymName;
    }

    // Return empty string if no data found
    return "";
  } catch (error) {
    console.error("Error fetching capital city:", error);
    // Return empty string on error
    return "";
  }
};

/**
 * Fetch the top most populated cities of a given state using GeoNames API
 * @param {string} stateCode - State code (e.g., TX)
 * @param {string} countryCode - Country code (e.g., US)
 * @returns {Promise<Array>} Array of city objects
 */
const getTop10Cities = async (stateCode, countryCode) => {
  try {
    console.log(`Fetching top 10 cities for ${stateCode}, ${countryCode}`);

    // First try to get cities for the state
    let url = `${API_CONFIG.GEONAMES_API_BASE}/searchJSON?country=${countryCode}&featureClass=P&adminCode1=${stateCode}&orderby=population&maxRows=10&username=${API_CONFIG.GEONAMES_USERNAME}`;
    console.log(`Fetching from URL: ${url}`);

    let response = await fetch(url);
    let data = await response.json();

    console.log("Top cities data:", data.geonames);

    // If no cities are found for the state, try country-level cities
    if (!data.geonames || data.geonames.length === 0) {
      console.log("No cities found for state, trying country-level cities");
      url = `${API_CONFIG.GEONAMES_API_BASE}/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=10&username=${API_CONFIG.GEONAMES_USERNAME}`;
      console.log(`Fetching from URL: ${url}`);

      response = await fetch(url);
      data = await response.json();
    }

    // Debug the returned data
    console.log(
      `Cities data received: ${data.geonames ? data.geonames.length : 0} cities`
    );

    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching top cities:", error);
    return []; // Return empty array on error, no fake data
  }
};

/**
 * Fetch cities data including capital and top 10 cities
 * @param {string} stateCode - State code (e.g., TX)
 * @param {string} countryCode - Country code (e.g., US)
 * @returns {Promise<Object>} Cities data object
 */
export const fetchCitiesData = async (stateCode, countryCode) => {
  try {
    console.log(`Fetching cities data for ${stateCode}, ${countryCode}`);

    // Use Promise.all to fetch both capital and top10 cities in parallel
    const [capitalCity, top10Cities] = await Promise.all([
      getCapitalCity(stateCode, countryCode),
      getTop10Cities(stateCode, countryCode),
    ]);

    console.log("Capital city:", capitalCity);
    console.log(
      "Top 10 cities count:",
      Array.isArray(top10Cities) ? top10Cities.length : 0
    );

    // Ensure we have valid data
    const validCapital = capitalCity || "";
    const validTop10 = Array.isArray(top10Cities) ? top10Cities : [];

    // Process cities data to get city1 and city2
    console.log("Setting up city1 and city2...");

    // Always select city1 as the largest non-capital city
    let city1;
    // Find the largest city that isn't the capital
    const largestNonCapital = validTop10.find(
      (city) => (city.toponymName || city.name) !== validCapital
    );

    if (largestNonCapital) {
      city1 = largestNonCapital;
      console.log(
        "Selected city1 (largest non-capital):",
        city1.toponymName || city1.name
      );
    } else {
      // Fallback - should rarely happen
      city1 = { name: "Houston", population: 2304580 };
      console.log("Using fallback for city1:", city1.name);
    }

    // Select city2 as the second largest non-capital city that isn't city1
    const city2 = validTop10.find(
      (city) =>
        (city.toponymName || city.name) !== validCapital &&
        (city.toponymName || city.name) !== (city1.toponymName || city1.name)
    ) || { name: "San Antonio", population: 1434625 };

    console.log("Selected city2:", city2.toponymName || city2.name);

    // Create the result object
    const result = {
      capital: validCapital,
      top10: validTop10,
      city1: {
        name: city1.toponymName || city1.name,
        population: city1.population || "",
        lat: city1.lat || "",
        lng: city1.lng || "",
      },
      city2: {
        name: city2.toponymName || city2.name,
        population: city2.population || "",
        lat: city2.lat || "",
        lng: city2.lng || "",
      },
    };

    console.log("Final cities data structure created");
    return result;
  } catch (error) {
    console.error("Error fetching cities data:", error);
    // Return minimal structure with no fake data
    return {
      capital: "",
      top10: [],
      city1: { name: "" },
      city2: { name: "" },
    };
  }
};

/**
 * Clean HTML content by removing unwanted tags
 * @param {string} htmlString - Raw HTML string
 * @returns {string} Cleaned HTML string
 */
const cleanHTML = (htmlString) => {
  // Parse the HTML string into a document
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove unwanted tags (e.g., <link>, <style>)
  doc.querySelectorAll("link, style, script").forEach((el) => el.remove());

  // Return the cleaned HTML as a string
  return doc.body.innerHTML;
};

/**
 * Fetch introduction and image from Wikipedia API
 * @param {string} state - State name
 * @param {string} city - City name (optional)
 * @param {boolean} isCity - Whether the search is for a city
 * @returns {Promise<Object>} Object with introduction and photo URL
 */
export const getIntroFromWiki = async (state, city, isCity = false) => {
  // Insert footer first (doesn't depend on API call)
  insertFooter(state);

  try {
    const searchQuery = isCity ? `${city}, ${state}` : state;
    let url = `${
      API_CONFIG.WIKI_API_BASE
    }?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${encodeURIComponent(
      searchQuery
    )}&origin=*&pithumbsize=1000`;

    // First attempt with full search query
    let response = await fetch(url);
    let data = await response.json();
    let pages = data.query.pages;
    let pageId = Object.keys(pages)[0];
    let pageData = pages[pageId];
    let intro = pageData.extract;

    // If no intro found, try with just the city name
    if (!intro && isCity) {
      url = `${
        API_CONFIG.WIKI_API_BASE
      }?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${encodeURIComponent(
        city
      )}&origin=*&pithumbsize=1000`;

      response = await fetch(url);
      data = await response.json();
      pages = data.query.pages;
      pageId = Object.keys(pages)[0];
      pageData = pages[pageId];
      intro = pageData.extract;
    }

    // If still no intro, use fallback text
    if (!intro) {
      intro = "No information found.";
      return { intro, photo: null };
    }

    // Clean HTML and get photo
    const html = cleanHTML(intro);
    let photo = null;

    if (pageData.thumbnail && pageData.thumbnail.source) {
      photo = pageData.thumbnail.source;
    }

    return { intro: html, photo };
  } catch (error) {
    console.error("Error fetching data from Wikipedia:", error);
    return {
      intro: "An error occurred while fetching information.",
      photo: null,
    };
  }
};

/**
 * Fetch population for a specific location using GeoNames API
 * @param {string} locationName - Name of the location (city or state)
 * @param {string} countryCode - Country code (e.g., US)
 * @returns {Promise<string|number>} Population count
 */
export const getPopulationData = async (locationName, countryCode) => {
  try {
    const response = await fetch(
      `${API_CONFIG.GEONAMES_API_BASE}/searchJSON?q=${encodeURIComponent(
        locationName
      )}&country=${countryCode}&maxRows=1&username=${
        API_CONFIG.GEONAMES_USERNAME
      }`
    );

    const data = await response.json();

    console.log("Population data:", data);

    return (
      data.geonames[0]?.population ||
      "Population data not available. Please use our form to update this information! Thank you!"
    );
  } catch (error) {
    console.error("Error fetching population data:", error);
    return "Population data not available";
  }
};

/**
 * Generate a session ID for salary API
 * @returns {string} Session ID
 */
const getSessionId = () => {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SALARY_SESSION_ID);
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(STORAGE_KEYS.SALARY_SESSION_ID, sessionId);
  }
  return sessionId;
};

/**
 * Fetch salary data for a city and state
 * @param {string} cityName - City name
 * @param {string} stateName - State name
 * @returns {Promise<Object|null>} Salary data object or null on error
 */
const fetchSalaryData = async (cityName, stateName) => {
  try {
    const sessionId = getSessionId();
    const response = await fetch(
      `${API_CONFIG.SALARY_API_BASE}/${encodeURIComponent(
        stateName
      )}/${encodeURIComponent(cityName)}`,
      {
        headers: {
          "X-Session-ID": sessionId,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch salary data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching salary data:", error);
    return null;
  }
};

/**
 * Get salary data for a city and state and update the UI
 * @param {string} cityName - City name
 * @param {string} stateName - State name
 */
export const getSalaryData = async (cityName, stateName) => {
  // Import the mock salary data generator
  const { getMockSalaryData } = await import("./mockSalary.js");

  // Update the city and state names in the UI
  $(".city-name").text(cityName);
  $(".state-name").text(stateName);

  try {
    // Get state code from stored data if available
    const initialData =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.INITIAL_DATA)) || {};
    const stateCode = initialData.state?.code;

    // Generate mock salary data
    const salaryData = getMockSalaryData(cityName, stateName, stateCode);

    if (salaryData) {
      updateSalaryComparison(salaryData);
    } else {
      showSalaryError();
    }
  } catch (error) {
    console.error("Error generating salary data:", error);
    showSalaryError();
  }
};

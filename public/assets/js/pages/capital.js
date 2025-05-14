/**
 * Capital city page (capital.html) functionality
 */

import { initializePage, loadLocationData } from "./base.js";
import {
  getIntroFromWiki,
  getPopulationData,
  getSalaryData,
  updateIntro,
  updatePhoto,
  updatePopulation,
} from "../utils/index.js";

/**
 * Initialize the capital city page
 */
const initializeCapitalPage = async () => {
  // Initialize base page functionality
  await initializePage();

  // Get data from storage
  const { initialData, citiesData } = await loadLocationData();

  try {
    // Fetch capital city info from Wikipedia
    const capitalIntro = await getIntroFromWiki(
      initialData.state.name,
      citiesData.capital,
      true
    );

    document.title = `${citiesData.capital} -  Capital City Info | Contact`;

    // Update page with capital city info
    updateIntro(capitalIntro.intro);
    updatePhoto(capitalIntro.photo);

    // Fetch and update capital city population
    const population = await getPopulationData(
      citiesData.capital,
      initialData.country.code
    );
    updatePopulation(population.toLocaleString());

    // Fetch salary data for the capital city
    await getSalaryData(citiesData.capital, initialData.state.name);
  } catch (error) {
    console.error("Error initializing capital page:", error);
    document.getElementById("intro").innerHTML =
      "An error occurred while fetching information about this city.";
  }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", initializeCapitalPage);

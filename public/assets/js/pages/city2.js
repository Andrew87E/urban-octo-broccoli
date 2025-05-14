/**
 * City 2 page (city2.html) functionality
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
 * Initialize the city 2 page
 */
const initializeCity2Page = async () => {
  // Initialize base page functionality
  await initializePage();

  // Get data from storage
  const { initialData, citiesData } = await loadLocationData();

  try {
    // Fetch city info from Wikipedia
    const cityIntro = await getIntroFromWiki(
      initialData.state.name,
      citiesData.city2.name,
      true
    );

    document.title = `${citiesData.city2.name} -  City Info | Contact`;

    // Update page with city info
    updateIntro(cityIntro.intro);
    updatePhoto(cityIntro.photo);

    // Fetch and update city population
    const population = await getPopulationData(
      citiesData.city2.name,
      initialData.country.code
    );
    updatePopulation(population.toLocaleString());

    // Fetch salary data for this city
    await getSalaryData(citiesData.city2.name, initialData.state.name);
  } catch (error) {
    console.error("Error initializing city2 page:", error);
    document.getElementById("intro").innerHTML =
      "An error occurred while fetching information about this city.";
  }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", initializeCity2Page);

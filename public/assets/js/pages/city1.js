/**
 * City 1 page (city1.html) functionality
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
 * Initialize the city 1 page
 */
const initializeCity1Page = async () => {
  // Initialize base page functionality
  await initializePage();

  // Get data from storage
  const { initialData, citiesData } = await loadLocationData();

  try {
    // Fetch city info from Wikipedia
    const cityIntro = await getIntroFromWiki(
      initialData.state.name,
      citiesData.city1.name,
      true
    );

    document.title = `${citiesData.city1.name} -  City Info | Contact`;

    // Update page with city info
    updateIntro(cityIntro.intro);
    updatePhoto(cityIntro.photo);

    // Fetch and update city population
    const population = await getPopulationData(
      citiesData.city1.name,
      initialData.country.code
    );
    updatePopulation(population.toLocaleString());

    // Fetch salary data for this city
    await getSalaryData(citiesData.city1.name, initialData.state.name);
  } catch (error) {
    console.error("Error initializing city1 page:", error);
    document.getElementById("intro").innerHTML =
      "An error occurred while fetching information about this city.";
  }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", initializeCity1Page);

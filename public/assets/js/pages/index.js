/**
 * Main page (index.html) functionality
 */

import { initializePage, loadLocationData } from "./base.js";
import {
  getIntroFromWiki,
  getPopulationData,
  updateIntro,
  updatePhoto,
  updatePopulation,
  updateTableWithCities,
} from "../utils/index.js";

/**
 * Initialize the home page
 */
const initializeHomePage = async () => {
  // Initialize base page functionality
  await initializePage();

  // Get data from storage
  const { initialData, citiesData } = await loadLocationData();
  // console.log("Initial Data:", citiesData);
  document.title = `${initialData.state.name} - State Info | Home`;

  try {
    // Fetch state info from Wikipedia
    const stateIntro = await getIntroFromWiki(initialData.state.name);

    // Update page with state info
    updateIntro(stateIntro.intro);
    updatePhoto(stateIntro.photo);

    // Fetch and update state population
    const population = await getPopulationData(
      initialData.state.name,
      initialData.country.code
    );

    // Update the population count
    if (population) {
      const formattedPopulation =
        typeof population === "number"
          ? population.toLocaleString()
          : population;
      updatePopulation(formattedPopulation);
    }

    // Update the table with cities

    updateTableWithCities(citiesData.top10);
  } catch (error) {
    console.error("Error initializing home page:", error);

    document.getElementById("intro").innerHTML =
      "An error occurred while fetching information about this state.";
  }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", initializeHomePage);

/**
 * Base page functionality that can be extended by specific pages
 */

import {
  getDataFromStorage,
  saveDataToStorage,
  getLocationData,
  fetchCitiesData,
  displayLoading,
  hideLoading,
  updateStateElement,
  updateCityElements,
  updateTableWithCities,
  initializeTheme,
} from "../utils/index.js";
import { STORAGE_KEYS } from "../config.js";

/**
 * Initialize page with common functionality
 */
export const initializePage = async () => {
  // Display loading indicator
  displayLoading();

  // Initialize theme
  initializeTheme();

  try {
    // Load data from storage or fetch if not available
    await loadLocationData();

    // Hide loading indicator when done
    hideLoading();
  } catch (error) {
    console.error("Error initializing page:", error);
    document.getElementById("error").style.display = "block";
    hideLoading();
  }
};

/**
 * Load or fetch location and cities data
 */
export const loadLocationData = async () => {
  try {
    // Get data from storage first
    let { initialData, citiesData } = getDataFromStorage();

    // If data doesn't exist in storage, fetch it
    if (!initialData || !citiesData) {
      initialData = await getLocationData();
      citiesData = await fetchCitiesData(
        initialData.state.code,
        initialData.country.code
      );

      // Save to storage for future use
      saveDataToStorage(STORAGE_KEYS.INITIAL_DATA, initialData);
      saveDataToStorage(STORAGE_KEYS.CITIES_DATA, citiesData);
    }

    // Update navigation elements with state and city names
    updateStateElement(initialData.state.name);
    updateCityElements(
      citiesData.city1.name || "",
      citiesData.city2.name || "",
      citiesData.capital || ""
    );

    // If population table exists and we have top10 data, update the table
    if (document.getElementById("population-table-body") && citiesData.top10) {
      updateTableWithCities(citiesData.top10);
    }

    return { initialData, citiesData };
  } catch (error) {
    console.error("Error loading location data:", error);
    document.getElementById("error").style.display = "block";
    hideLoading();

    // Return minimal data to prevent further errors
    return {
      initialData: { state: { name: "" }, country: { code: "" } },
      citiesData: {
        city1: { name: "" },
        city2: { name: "" },
        capital: "",
        top10: [],
      },
    };
  }
};

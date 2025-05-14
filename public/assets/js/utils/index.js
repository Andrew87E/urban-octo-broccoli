/**
 * Barrel file that exports all utility functions
 */

// DOM manipulation utilities
export {
  displayLoading,
  hideLoading,
  updateIntro,
  updatePhoto,
  updatePopulation,
  updateStateElement,
  updateCityElements,
  updateTableWithCities,
  updateSalaryComparison,
  showSalaryError,
  insertFooter,
} from "./dom.js";

// API utilities
// Export all API functions directly to avoid import path issues
export * from "./api.js";

// Storage utilities
export {
  getDataFromStorage,
  saveDataToStorage,
  clearStorage,
} from "./storage.js";

// Theme utilities
export { initializeTheme, toggleTheme } from "./theme.js";

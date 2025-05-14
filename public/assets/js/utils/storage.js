/**
 * Local storage utilities
 */

import { STORAGE_KEYS } from "../config.js";

/**
 * Get location and cities data from localStorage
 * @returns {Object} Object containing initialData and citiesData
 */
export const getDataFromStorage = () => {
  try {
    const initialData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.INITIAL_DATA)
    );
    const citiesData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CITIES_DATA)
    );

    return { initialData, citiesData };
  } catch (error) {
    console.error("Error retrieving data from storage:", error);
    return { initialData: null, citiesData: null };
  }
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {Object} data - Data to save
 */
export const saveDataToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.INITIAL_DATA);
    localStorage.removeItem(STORAGE_KEYS.CITIES_DATA);
    localStorage.removeItem(STORAGE_KEYS.SALARY_SESSION_ID);
    // Don't clear theme preference
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

/**
 * This file was originally created for mock city data,
 * but we're now only using actual API data per requirements.
 *
 * This file is kept as a placeholder in case we need to add
 * utility functions for city data processing in the future.
 */

/**
 * Generate data for a specific state by code
 * Currently only supports Texas, but can be expanded
 * @param {string} stateCode - Two-letter state code
 * @returns {Array} Array of city objects for the state
 */
export const getMockCitiesByState = (stateCode) => {
  // For now, we only have Texas data, but this can be expanded
  if (stateCode === "TX") {
    return getTexasCities();
  }

  // For other states, generate placeholder data
  return generatePlaceholderCities(stateCode, 10);
};

/**
 * Generate placeholder city data for a state
 * @param {string} stateCode - Two-letter state code
 * @param {number} count - Number of cities to generate
 * @returns {Array} Array of city objects
 */
export const generatePlaceholderCities = (stateCode, count) => {
  const cities = [];
  for (let i = 1; i <= count; i++) {
    cities.push({
      toponymName: `${stateCode} City ${i}`,
      name: `${stateCode} City ${i}`,
      population: 100000 * (11 - i), // Descending population
      lat: (Math.random() * 10 + 30).toFixed(5), // Random but plausible coordinates
      lng: (Math.random() * 10 - 100).toFixed(5),
    });
  }
  return cities;
};

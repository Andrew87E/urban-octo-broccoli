/**
 * Enhanced mock salary data generator
 */

import { STORAGE_KEYS } from "../config.js";

// Salary ranges by region (for more realistic data)
const SALARY_RANGES = {
  // Northeast
  NE: { min: 55000, max: 120000, stateAvg: 65000 },
  MA: { min: 60000, max: 125000, stateAvg: 72000 },
  CT: { min: 62000, max: 130000, stateAvg: 75000 },
  NH: { min: 54000, max: 110000, stateAvg: 68000 },
  RI: { min: 52000, max: 105000, stateAvg: 62000 },
  VT: { min: 50000, max: 95000, stateAvg: 58000 },
  NY: { min: 65000, max: 160000, stateAvg: 85000 },
  NJ: { min: 63000, max: 130000, stateAvg: 78000 },
  PA: { min: 54000, max: 105000, stateAvg: 65000 },

  // Midwest
  OH: { min: 48000, max: 95000, stateAvg: 58000 },
  MI: { min: 49000, max: 98000, stateAvg: 59000 },
  IN: { min: 46000, max: 92000, stateAvg: 54000 },
  IL: { min: 52000, max: 110000, stateAvg: 68000 },
  WI: { min: 48000, max: 95000, stateAvg: 56000 },
  MN: { min: 53000, max: 105000, stateAvg: 65000 },
  IA: { min: 46000, max: 90000, stateAvg: 54000 },
  MO: { min: 45000, max: 92000, stateAvg: 53000 },
  ND: { min: 48000, max: 95000, stateAvg: 60000 },
  SD: { min: 44000, max: 88000, stateAvg: 52000 },
  NE: { min: 45000, max: 90000, stateAvg: 55000 },
  KS: { min: 46000, max: 92000, stateAvg: 55000 },

  // South
  TX: { min: 50000, max: 110000, stateAvg: 62000 },
  OK: { min: 44000, max: 88000, stateAvg: 52000 },
  AR: { min: 42000, max: 85000, stateAvg: 48000 },
  LA: { min: 43000, max: 92000, stateAvg: 52000 },
  MS: { min: 40000, max: 80000, stateAvg: 45000 },
  AL: { min: 42000, max: 85000, stateAvg: 49000 },
  TN: { min: 44000, max: 90000, stateAvg: 53000 },
  KY: { min: 43000, max: 88000, stateAvg: 51000 },
  WV: { min: 42000, max: 85000, stateAvg: 48000 },
  VA: { min: 54000, max: 115000, stateAvg: 70000 },
  NC: { min: 48000, max: 100000, stateAvg: 58000 },
  SC: { min: 45000, max: 92000, stateAvg: 53000 },
  GA: { min: 48000, max: 105000, stateAvg: 60000 },
  FL: { min: 48000, max: 108000, stateAvg: 59000 },
  DE: { min: 52000, max: 105000, stateAvg: 62000 },
  MD: { min: 58000, max: 125000, stateAvg: 72000 },
  DC: { min: 70000, max: 160000, stateAvg: 95000 },

  // West
  CA: { min: 65000, max: 150000, stateAvg: 85000 },
  OR: { min: 54000, max: 110000, stateAvg: 65000 },
  WA: { min: 60000, max: 135000, stateAvg: 75000 },
  NV: { min: 48000, max: 110000, stateAvg: 58000 },
  ID: { min: 45000, max: 92000, stateAvg: 53000 },
  MT: { min: 45000, max: 90000, stateAvg: 52000 },
  WY: { min: 47000, max: 95000, stateAvg: 56000 },
  CO: { min: 55000, max: 115000, stateAvg: 68000 },
  UT: { min: 50000, max: 105000, stateAvg: 60000 },
  AZ: { min: 48000, max: 105000, stateAvg: 58000 },
  NM: { min: 44000, max: 92000, stateAvg: 52000 },
  HI: { min: 60000, max: 120000, stateAvg: 72000 },
  AK: { min: 58000, max: 120000, stateAvg: 70000 },

  // Default (if state not found)
  DEFAULT: { min: 45000, max: 95000, stateAvg: 55000 },
};

// City type averages per state (percentage above/below state average)
const CITY_TYPE_AVERAGES = {
  capital: { avgSalary: 1.12 }, // Capital cities average 12% above state average
  nonCapital: { avgSalary: 0.96 }, // Non-capital cities average 4% below state average
};

/**
 * Generate a random number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer between min and max (inclusive)
 */
const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get the state range for salary calculations
 * @param {string} stateCode - Two-letter state code
 * @returns {Object} Object with min, max, and stateAvg values
 */
const getStateRange = (stateCode) => {
  return SALARY_RANGES[stateCode] || SALARY_RANGES["DEFAULT"];
};

/**
 * Generate a city salary based on state information and city type
 * @param {string} stateName - Full state name
 * @param {string} stateCode - Two-letter state code
 * @param {string} cityName - City name
 * @param {string} cityType - Type of city (capital, large, medium, small)
 * @returns {number} Calculated salary for the city
 */
const generateCitySalary = (stateName, stateCode, cityName, cityType) => {
  const range = getStateRange(stateCode);
  const { min, max, stateAvg } = range;

  // City type modifiers
  const modifiers = {
    capital: { min: 1.05, max: 1.15 }, // Capitals usually have higher salaries
    large: { min: 1.1, max: 1.2 }, // Large cities have higher salaries
    medium: { min: 0.95, max: 1.05 }, // Medium cities are around state average
    small: { min: 0.8, max: 0.95 }, // Small cities have lower salaries
  };

  // Determine city type based on name (for consistency)
  let cityTypeForCalc = cityType;
  if (!cityTypeForCalc) {
    // Simple algorithm to determine city type based on name
    // This ensures the same city always gets the same type
    const nameSum = cityName
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const types = ["small", "medium", "medium", "large"]; // Weighted towards medium cities
    cityTypeForCalc = types[nameSum % types.length];
  }

  const modifier = modifiers[cityTypeForCalc] || modifiers.medium;

  // Generate a modifier within the range for this city type
  const actualModifier =
    getRandomInRange(modifier.min * 100, modifier.max * 100) / 100; // Convert to decimal (e.g., 1.05)

  // Calculate city salary based on state average and modifier
  const citySalary = Math.round((stateAvg * actualModifier) / 1000) * 1000; // Round to nearest thousand

  return citySalary;
};

/**
 * Calculate percentage difference between two values
 * @param {number} a - First value
 * @param {number} b - Second value (usually the reference value)
 * @returns {number} Percentage difference
 */
const calculatePercentageDiff = (a, b) => {
  return Math.round(((a - b) / b) * 100);
};

/**
 * Generate comparative salary data for capital cities vs. rest of state
 * @param {string} stateCode - Two-letter state code
 * @returns {Object} Object with capital salary data
 */
const generateCapitalComparison = (stateCode) => {
  const stateData = getStateRange(stateCode);
  const stateAvg = stateData.stateAvg;

  // Calculate capital average (12% above state average)
  const capitalAvg = Math.round(
    stateAvg * CITY_TYPE_AVERAGES.capital.avgSalary
  );

  // Calculate non-capital average (4% below state average)
  const nonCapitalAvg = Math.round(
    stateAvg * CITY_TYPE_AVERAGES.nonCapital.avgSalary
  );

  // Calculate percentage differences
  const capitalDiff = calculatePercentageDiff(capitalAvg, stateAvg);
  const nonCapitalDiff = calculatePercentageDiff(nonCapitalAvg, stateAvg);

  return {
    capitalSalary: capitalAvg,
    nonCapitalSalary: nonCapitalAvg,
    capitalDiffFromState: capitalDiff,
    nonCapitalDiffFromState: nonCapitalDiff,
    stateAverage: stateAvg,
  };
};

/**
 * Generate consistent mock salary data for a city
 * @param {string} cityName - Name of the city
 * @param {string} stateName - Name of the state
 * @param {string} stateCode - Two-letter state code (optional)
 * @returns {Object} Salary data object
 */
export const getMockSalaryData = (cityName, stateName, stateCode) => {
  // Check if we already have data in localStorage
  const storageKey = `${STORAGE_KEYS.SALARY_SESSION_ID}_${cityName}_${stateName}`;
  const existingData = localStorage.getItem(storageKey);

  if (existingData) {
    return JSON.parse(existingData);
  }

  // If no state code provided, derive it from state name
  const derivedStateCode = stateCode || getStateCodeFromName(stateName);

  // Determine if this is a capital city (for realistic data)
  const isCapital =
    cityName.toLowerCase().includes("capital") ||
    cityName.includes("Austin") ||
    cityName.includes("Sacramento") ||
    cityName.includes("Albany");

  // Get state average from our ranges
  const range = getStateRange(derivedStateCode);
  const stateAverageSalary = range.stateAvg;

  // Generate city salary based on characteristics
  const cityType = isCapital ? "capital" : null; // Let the function determine for non-capitals
  const averageSalary = generateCitySalary(
    stateName,
    derivedStateCode,
    cityName,
    cityType
  );

  // Calculate percentage difference
  const percentageDifference = calculatePercentageDiff(
    averageSalary,
    stateAverageSalary
  );

  // Generate comparison data between capital and non-capital cities
  const comparisonData = generateCapitalComparison(derivedStateCode);

  // Create the complete data object with all the required information
  const salaryData = {
    cityName,
    stateName,
    isCapital,
    averageSalary,
    stateAverageSalary,
    percentageDifference,
    // New data for the capital vs. rest of state comparison
    capitalAvgSalary: comparisonData.capitalSalary,
    nonCapitalAvgSalary: comparisonData.nonCapitalSalary,
    capitalVsStateDiff: comparisonData.capitalDiffFromState,
    nonCapitalVsStateDiff: comparisonData.nonCapitalDiffFromState,
  };

  // Save to localStorage for consistency across pages
  localStorage.setItem(storageKey, JSON.stringify(salaryData));

  return salaryData;
};

/**
 * Get two-letter state code from full state name
 * @param {string} stateName - Full state name
 * @returns {string} Two-letter state code or DEFAULT if not found
 */
const getStateCodeFromName = (stateName) => {
  const stateMap = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
  };

  // Try to match the state name (case insensitive)
  for (const [name, code] of Object.entries(stateMap)) {
    if (name.toLowerCase() === stateName.toLowerCase()) {
      return code;
    }
  }

  // If not found, return DEFAULT
  return "DEFAULT";
};

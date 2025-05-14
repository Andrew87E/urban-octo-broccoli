/**
 * Main configuration file for the application
 */

// API Configuration
export const API_CONFIG = {
  // Base URLs
  GEO_API_BASE: "https://www.edwards.codes/api/test",
  WIKI_API_BASE: "https://en.wikipedia.org/w/api.php",
  SALARY_API_BASE: "https://edwards.codes/api/salary",
  GEONAMES_API_BASE: "https://secure.geonames.org",
  GEONAMES_USERNAME: "secret8squirrel",
};

// Storage keys
export const STORAGE_KEYS = {
  INITIAL_DATA: "initialData",
  CITIES_DATA: "citiesData",
  THEME: "theme",
  SALARY_SESSION_ID: "salary-session-id",
};

// DOM element IDs and classes
export const DOM_ELEMENTS = {
  // Common elements
  LOADING: "loading",
  ERROR: "error",
  INTRO: "intro",
  PHOTO: "pic",
  POPULATION_COUNT: "population-count",
  FOOTER: "footer",

  // Classes for text elements
  STATE_NAME_CLASS: "state-name",
  CAPITAL_CITY_CLASS: "capital-city",
  CITY_1_CLASS: "city-1",
  CITY_2_CLASS: "city-2",
  CITY_NAME_CLASS: "city-name",

  // Theme toggle
  THEME_TOGGLE: "theme-toggle",

  // Salary comparison elements
  SALARY_LOADING: "salary-comparison-loading",
  SALARY_CONTENT: "salary-comparison-content",
  SALARY_ERROR: "salary-comparison-error",
  CITY_SALARY: "city-average-salary",
  STATE_SALARY: "state-average-salary",
  SALARY_PERCENTAGE: "salary-percentage",
  COMPARISON_TEXT: "comparison-text",

  // Table elements
  POPULATION_TABLE_BODY: "population-table-body",
};

// CSS Classes
export const CSS_CLASSES = {
  HIDDEN: "hidden",
  TEXT_DANGER: "text-danger",
  TEXT_SUCCESS: "text-success",
  ANIMATE_SPIN: "animate-spin",
};

// Theme options
export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

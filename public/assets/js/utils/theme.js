/**
 * Theme management utilities
 */

import { STORAGE_KEYS, THEMES, DOM_ELEMENTS, CSS_CLASSES } from "../config.js";

/**
 * Check for saved theme preference or system preference
 * @returns {string} The preferred theme ('dark' or 'light')
 */
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('dark' or 'light')
 */
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Initialize theme based on preferences
 */
export const initializeTheme = () => {
  // Apply initial theme
  setTheme(getPreferredTheme());

  // Add event listener for theme toggle button
  const themeToggle = document.getElementById(DOM_ELEMENTS.THEME_TOGGLE);
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    });
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
  const themeToggle = document.getElementById(DOM_ELEMENTS.THEME_TOGGLE);
  if (themeToggle) {
    themeToggle.classList.add(CSS_CLASSES.ANIMATE_SPIN);
    setTimeout(() => {
      themeToggle.classList.remove(CSS_CLASSES.ANIMATE_SPIN);
    }, 500);
  }

  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(newTheme);
};

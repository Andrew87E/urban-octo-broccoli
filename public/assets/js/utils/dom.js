/**
 * DOM manipulation utilities
 */

import { DOM_ELEMENTS, CSS_CLASSES } from "../config.js";

/**
 * Display loading animation
 */
export const displayLoading = () => {
  const loading = document.getElementById(DOM_ELEMENTS.LOADING);
  if (loading) loading.style.display = "block";
};

/**
 * Hide loading animation
 */
export const hideLoading = () => {
  const loading = document.getElementById(DOM_ELEMENTS.LOADING);
  if (loading) loading.style.display = "none";
};

/**
 * Update the intro section with HTML content
 * @param {string} intro - HTML content for the intro section
 */
export const updateIntro = (intro) => {
  const introElement = document.getElementById(DOM_ELEMENTS.INTRO);
  if (introElement) introElement.innerHTML = intro;
};

/**
 * Update the photo element with a new source
 * @param {string} photoUrl - URL of the photo to display
 */
export const updatePhoto = (photoUrl) => {
  const photoElements = document.getElementsByClassName(DOM_ELEMENTS.PHOTO);
  if (photoElements.length === 0) return;

  Array.from(photoElements).forEach((element) => {
    element.src = photoUrl;
  });
};

/**
 * Update the population count element
 * @param {string|number} population - Population count to display
 */
export const updatePopulation = (population) => {
  const populationElement = document.getElementById(
    DOM_ELEMENTS.POPULATION_COUNT
  );
  if (!populationElement) return;

  populationElement.textContent = population;

  if (String(population).includes("Population data not available")) {
    populationElement.classList.add(CSS_CLASSES.TEXT_DANGER);
  } else {
    populationElement.classList.remove(CSS_CLASSES.TEXT_DANGER);
  }
};

/**
 * Update all state name elements on the page
 * @param {string} stateName - Name of the state to display
 */
export const updateStateElement = (stateName) => {
  const stateElements = document.querySelectorAll(
    `.${DOM_ELEMENTS.STATE_NAME_CLASS}`
  );
  if (stateElements.length === 0) return;

  stateElements.forEach((element) => {
    element.textContent = stateName;
  });
};

/**
 * Update all city name elements on the page
 * @param {string} city1Name - Name of city 1
 * @param {string} city2Name - Name of city 2
 * @param {string} capitalName - Name of the capital city
 */
export const updateCityElements = (city1Name, city2Name, capitalName) => {
  // Update city 1 elements
  const city1Elements = document.querySelectorAll(
    `.${DOM_ELEMENTS.CITY_1_CLASS}`
  );
  city1Elements.forEach((element) => {
    element.textContent = city1Name;
  });

  // Update city 2 elements
  const city2Elements = document.querySelectorAll(
    `.${DOM_ELEMENTS.CITY_2_CLASS}`
  );
  city2Elements.forEach((element) => {
    element.textContent = city2Name;
  });

  // Update capital city elements
  const capitalElements = document.querySelectorAll(
    `.${DOM_ELEMENTS.CAPITAL_CITY_CLASS}`
  );
  capitalElements.forEach((element) => {
    element.textContent = capitalName;
  });

  // Update generic city name elements (if any)
  const cityNameElements = document.querySelectorAll(
    `.${DOM_ELEMENTS.CITY_NAME_CLASS}`
  );
  if (cityNameElements.length > 0) {
    // Determine which city to use based on the current page
    let cityName = capitalName; // Default to capital

    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "city1.html") {
      cityName = city1Name;
    } else if (currentPage === "city2.html") {
      cityName = city2Name;
    }

    cityNameElements.forEach((element) => {
      element.textContent = cityName;
    });
  }
};

/**
 * Update the population table with city data
 * @param {Array} cities - Array of city objects with name, population, and coordinates
 */
export const updateTableWithCities = (cities) => {
  console.log("updateTableWithCities called with:", cities);

  const tableBody = document.getElementById(DOM_ELEMENTS.POPULATION_TABLE_BODY);
  if (!tableBody) {
    console.error("Population table body element not found");
    return;
  }

  // Clear existing rows
  tableBody.innerHTML = "";

  // Check if cities is defined and is an array
  if (!cities || !Array.isArray(cities)) {
    console.log("Cities data is undefined or not an array");

    // Add a message row
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "Loading city data...";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  // If array is empty, add a message
  if (cities.length === 0) {
    console.log("Cities array is empty");
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No city data available";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  console.log(`Adding ${cities.length} cities to table`);

  // Add new rows
  cities.forEach((city, index) => {
    try {
      console.log(`Processing city ${index}:`, city);

      const row = document.createElement("tr");

      // City name cell
      const nameCell = document.createElement("td");
      const cityName = city.toponymName || city.name || "N/A";
      nameCell.textContent = cityName;
      row.appendChild(nameCell);

      // Population cell
      const popCell = document.createElement("td");
      if (city.population) {
        try {
          popCell.textContent = Number(city.population).toLocaleString();
        } catch (e) {
          console.warn(`Error formatting population for ${cityName}:`, e);
          popCell.textContent = String(city.population);
        }
      } else {
        popCell.textContent = "N/A";
      }
      row.appendChild(popCell);

      // Coordinates cell
      const coordCell = document.createElement("td");
      try {
        if (city.lat && city.lng) {
          coordCell.textContent = `${parseFloat(city.lat).toFixed(
            2
          )}, ${parseFloat(city.lng).toFixed(2)}`;
        } else {
          coordCell.textContent = "N/A";
        }
      } catch (e) {
        console.warn(`Error formatting coordinates for ${cityName}:`, e);
        coordCell.textContent = "N/A";
      }
      row.appendChild(coordCell);

      tableBody.appendChild(row);
    } catch (e) {
      console.error(`Error processing city ${index}:`, e);
    }
  });

  console.log("Table updated with actual API data");
};

/**
 * Updated DOM utility to display the enhanced salary data
 * This extends the existing updateSalaryComparison function
 */

/**
 * Update salary comparison section with enhanced capital/non-capital data
 * @param {Object} data - Enhanced salary data object
 */
export const updateSalaryComparison = (data) => {
  if (!data) {
    $(`#${DOM_ELEMENTS.SALARY_LOADING}`).addClass(CSS_CLASSES.HIDDEN);
    $(`#${DOM_ELEMENTS.SALARY_ERROR}`).removeClass(CSS_CLASSES.HIDDEN);
    return;
  }

  // Update basic salary values
  $(`#${DOM_ELEMENTS.CITY_SALARY}`).text(data.averageSalary.toLocaleString());
  $(`#${DOM_ELEMENTS.STATE_SALARY}`).text(
    data.stateAverageSalary.toLocaleString()
  );
  $(`#${DOM_ELEMENTS.SALARY_PERCENTAGE}`).text(
    Math.abs(data.percentageDifference)
  );

  // Update comparison text for city vs state
  const comparisonText = $(`#${DOM_ELEMENTS.COMPARISON_TEXT}`);
  comparisonText
    .removeClass(CSS_CLASSES.TEXT_SUCCESS)
    .removeClass(CSS_CLASSES.TEXT_DANGER);

  if (data.percentageDifference > 0) {
    comparisonText.text("higher");
    comparisonText.addClass(CSS_CLASSES.TEXT_SUCCESS);
  } else if (data.percentageDifference < 0) {
    comparisonText.text("lower");
    comparisonText.addClass(CSS_CLASSES.TEXT_DANGER);
  } else {
    comparisonText.text("the same as");
  }

  // Add the new capital vs non-capital comparisons
  // First, check if the elements exist - add them if they don't
  if ($("#capital-comparison").length === 0) {
    addCapitalComparisonSection();
  }

  // Update the capital comparison values
  $("#capital-avg-salary").text(data.capitalAvgSalary.toLocaleString());
  $("#noncapital-avg-salary").text(data.nonCapitalAvgSalary.toLocaleString());

  // Update capital vs state difference
  $("#capital-percentage").text(Math.abs(data.capitalVsStateDiff));
  const capitalCompText = $("#capital-comparison-text");
  capitalCompText
    .removeClass(CSS_CLASSES.TEXT_SUCCESS)
    .removeClass(CSS_CLASSES.TEXT_DANGER);

  if (data.capitalVsStateDiff > 0) {
    capitalCompText.text("higher");
    capitalCompText.addClass(CSS_CLASSES.TEXT_SUCCESS);
  } else {
    capitalCompText.text("lower");
    capitalCompText.addClass(CSS_CLASSES.TEXT_DANGER);
  }

  // Update non-capital vs state difference
  $("#noncapital-percentage").text(Math.abs(data.nonCapitalVsStateDiff));
  const nonCapitalCompText = $("#noncapital-comparison-text");
  nonCapitalCompText
    .removeClass(CSS_CLASSES.TEXT_SUCCESS)
    .removeClass(CSS_CLASSES.TEXT_DANGER);

  if (data.nonCapitalVsStateDiff > 0) {
    nonCapitalCompText.text("higher");
    nonCapitalCompText.addClass(CSS_CLASSES.TEXT_SUCCESS);
  } else {
    nonCapitalCompText.text("lower");
    nonCapitalCompText.addClass(CSS_CLASSES.TEXT_DANGER);
  }

  // Show content, hide loading and error
  $(`#${DOM_ELEMENTS.SALARY_LOADING}`).addClass(CSS_CLASSES.HIDDEN);
  $(`#${DOM_ELEMENTS.SALARY_CONTENT}`).removeClass(CSS_CLASSES.HIDDEN);
  $(`#${DOM_ELEMENTS.SALARY_ERROR}`).addClass(CSS_CLASSES.HIDDEN);
};

/**
 * Add the new capital comparison section to the salary comparison container
 */
function addCapitalComparisonSection() {
  const capitalComparisonHTML = `
    <div id="capital-comparison" class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="font-bold text-lg mb-3">Capital vs. Non-Capital Cities</h4>
      
      <ul class="city-facts-list">
        <li>
          <div class="fact-icon">🏛️</div>
          <div class="fact-content">
            <div class="fact-title">Average Salary in Capital Cities</div>
            <div class="fact-value">$<span id="capital-avg-salary">0</span> per year</div>
          </div>
        </li>
        <li>
          <div class="fact-icon">🏙️</div>
          <div class="fact-content">
            <div class="fact-title">Average Salary in Non-Capital Cities</div>
            <div class="fact-value">$<span id="noncapital-avg-salary">0</span> per year</div>
          </div>
        </li>
        <li>
          <div class="fact-icon">📊</div>
          <div class="fact-content">
            <div class="fact-title">Capital Cities vs. State Average</div>
            <div class="fact-value"><span id="capital-percentage">0</span>% <span
                id="capital-comparison-text">different</span> than state average</div>
          </div>
        </li>
        <li>
          <div class="fact-icon">📈</div>
          <div class="fact-content">
            <div class="fact-title">Non-Capital Cities vs. State Average</div>
            <div class="fact-value"><span id="noncapital-percentage">0</span>% <span
                id="noncapital-comparison-text">different</span> than state average</div>
          </div>
        </li>
      </ul>
    </div>
  `;

  // Append the new section to the salary comparison content
  $(`#${DOM_ELEMENTS.SALARY_CONTENT}`).append(capitalComparisonHTML);
}

/**
 * Show error message in the salary comparison section
 */
export const showSalaryError = () => {
  $(`#${DOM_ELEMENTS.SALARY_LOADING}`).addClass(CSS_CLASSES.HIDDEN);
  $(`#${DOM_ELEMENTS.SALARY_CONTENT}`).addClass(CSS_CLASSES.HIDDEN);
  $(`#${DOM_ELEMENTS.SALARY_ERROR}`).removeClass(CSS_CLASSES.HIDDEN);
};

/**
 * Insert footer content
 * @param {string} stateName - Name of the state
 */
export const insertFooter = (stateName) => {
  const currentYear = new Date().getFullYear();
  const footer = `
    <p>&copy; ${currentYear} ${stateName} Government Office</p>
    <p id="subtext">Powered by <a href="https://www.geonames.org/" target="_blank">GeoNames</a> and <a href="https://www.wikipedia.org/" target="_blank">Wikipedia</a></p>
    <p id="small-subtext">Made with <a href="https://www.edwards.codes/" target="_blank" style="color: #e81324;">&#10084;</a> by <a href="https://www.github.com/andrew87e" target="_blank" style="color: #42f566;">Andrew Edwards</a></p>
  `;

  const footerElement = document.getElementById(DOM_ELEMENTS.FOOTER);
  if (footerElement) footerElement.innerHTML = footer;
};

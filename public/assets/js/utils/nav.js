export const updateStateEl = (state) => {
  const stateElements = document.querySelectorAll(".state-name");
  if (stateElements.length === 0) {
    console.error("No elements with class 'state-name' found.");
    return;
  }

  stateElements.forEach((element) => {
    element.textContent = state;
  });
};

export const updateCitiesEl = (city1, city2, capital) => {
  const city1Element = document.querySelectorAll(".city-1");
  const city2Element = document.querySelectorAll(".city-2");
  const capitalElement = document.querySelectorAll(".capital-city");

  if (city1Element.length > 0) {
    city1Element.forEach((element) => {
      element.textContent = city1;
    });
  } else {
    console.error("No elements with class 'city-1' found. Skipping...");
  }

  if (city2Element.length > 0) {
    city2Element.forEach((element) => {
      element.textContent = city2;
    });
  } else {
    console.error("No elements with class 'city-2' found. Skipping...");
  }

  if (capitalElement.length > 0) {
    capitalElement.forEach((element) => {
      element.textContent = capital;
    });
  } else {
    console.error("No elements with class 'capital-city' found. Skipping...");
  }
};

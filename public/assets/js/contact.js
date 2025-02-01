import {
  getDataFromStorage,
  getLocationData,
  fetchCitiesData,
  getIntroFromWiki,
  displayLoading,
  hideLoading,
  updatePhoto,
  updateStateEl,
  updateCitiesEl,
  insertFooter,
} from "./utils/index.js";

// Update state, city, and interesting facts
const updateContent = async () => {
  console.log("updateContent");
  let { initialData, citiesData } = getDataFromStorage();
  if (!initialData || !citiesData) {
    initialData = await getLocationData();
    citiesData = await fetchCitiesData(
      initialData.state.code,
      initialData.country.code
    );
    localStorage.setItem("initialData", JSON.stringify(initialData));
    localStorage.setItem("citiesData", JSON.stringify(citiesData));
  }

  const city1 = citiesData.city1;
  const city2 = citiesData.city2;
  const capital = citiesData.capital;

  // Nav update
  updateStateEl(initialData.state.name);
  updateCitiesEl(city1.name, city2.name, capital);
  insertFooter(initialData.state.name);
  //  update contact-pic
  let photo = localStorage.getItem("stateIntroPhoto");

  if (photo) {
    const fixedPhoto = photo.substring(1, photo.length - 1);
    console.log("photo from local storage", fixedPhoto);
    updatePhoto(fixedPhoto);
  } else {
    console.log("photo from wiki");
    const capitalIntro = await getIntroFromWiki(
      initialData.state.name,
      citiesData.capital,
      true
    );
    const fixedPhoto = photo.substring(1, photo.length - 1);
    updatePhoto(capitalIntro.photo);
    localStorage.setItem("stateIntroPhoto", JSON.stringify(fixedPhoto));
  }
};

// Run content update
displayLoading();
updateContent().then(hideLoading);

// Form state management
let submitAttempts = 0;
let lastSubmitTime = 0;
let isSubmitting = false;

// Get form elements
const form = document.getElementById("contactForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const confirmEmailInput = document.getElementById("confirmEmail");
const questionInput = document.getElementById("question");

// Create error display element
const errorDiv = document.createElement("div");
errorDiv.className = "error-message hidden";
errorDiv.style.color = "red";
errorDiv.style.marginBottom = "1rem";
form.insertBefore(errorDiv, form.querySelector("button"));

// Create success display element
const successDiv = document.createElement("div");
successDiv.className = "success-message hidden";
successDiv.style.color = "green";
successDiv.style.marginBottom = "1rem";
form.insertBefore(successDiv, form.querySelector("button"));

// Form validation
function validateForm() {
  // Clear previous error messages
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");

  // Check rate limiting
  const now = Date.now();
  if (now - lastSubmitTime < 30000) {
    // 30 seconds between submissions
    return "Please wait 30 seconds before submitting again";
  }
  if (submitAttempts >= 5) {
    return "Maximum submission attempts reached. Please try again later";
  }

  // Validate required fields
  if (!firstNameInput.value.trim()) return "First name is required";
  if (!lastNameInput.value.trim()) return "Last name is required";
  if (!emailInput.value.trim()) return "Email is required";
  if (!confirmEmailInput.value.trim()) return "Please confirm your email";
  if (!questionInput.value.trim()) return "Question is required";

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    return "Please enter a valid email address";
  }

  // Validate email match
  if (emailInput.value !== confirmEmailInput.value) {
    return "Email addresses do not match";
  }

  if (questionInput.value.length < 10) {
    return "Question must be at least 10 characters";
  }

  if (questionInput.value.length > 500) {
    return "Question must be less than 500 characters";
  }

  if (firstNameInput.value.length > 50) {
    return "First name must be less than 50 characters";
  }

  if (lastNameInput.value.length > 50) {
    return "Last name must be less than 50 characters";
  }

  if (emailInput.value.length > 50 || confirmEmailInput.value.length > 50) {
    return "Email must be less than 50 characters";
  }

  return "";
}

// Show loading spinner
function showLoadingButton() {
  const submitButton = form.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  isSubmitting = true;
}

// Hide loading spinner
function hideLoadingButton() {
  const submitButton = form.querySelector("button");
  submitButton.disabled = false;
  submitButton.textContent = "Submit";
  isSubmitting = false;
}

// Show error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  successDiv.classList.add("hidden");
}

// Show success message
function showSuccess() {
  successDiv.textContent =
    "Thank you for your submission! We'll get back to you soon.";
  successDiv.classList.remove("hidden");
  errorDiv.classList.add("hidden");
  form.reset();
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting) return;

  const error = validateForm();
  if (error) {
    showError(error);
    return;
  }

  showLoadingButton();

  try {
    // Get stored location data
    const initialData = JSON.parse(localStorage.getItem("initialData"));

    const response = await fetch("https://www.edwards.codes/api/test/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fName: firstNameInput.value,
        lName: lastNameInput.value,
        email: emailInput.value,
        question: questionInput.value,
        initialData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 420) {
        throw new Error(
          "We haven't gotten to your last submission yet, please wait a bit before submitting again."
        );
      }
      throw new Error(data.message || "Submission failed");
    }

    showSuccess();
    submitAttempts++;
    lastSubmitTime = Date.now();
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoadingButton();
  }
}

// Add form submission listener
form.addEventListener("submit", handleSubmit);

// Add input listeners to clear error on type
const inputs = [
  firstNameInput,
  lastNameInput,
  emailInput,
  confirmEmailInput,
  questionInput,
];
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    errorDiv.classList.add("hidden");
  });
});

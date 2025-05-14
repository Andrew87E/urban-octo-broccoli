/**
 * Contact page (contact.html) functionality
 */

import { initializePage } from "./base.js";
import { insertFooter } from "../utils/dom.js";
import { STORAGE_KEYS } from "../config.js";

/**
 * Initialize the contact page
 */
const initializeContactPage = async () => {
  // Initialize base page functionality
  await initializePage();

  // Get state name from storage for footer
  const initialData =
    JSON.parse(localStorage.getItem(STORAGE_KEYS.INITIAL_DATA)) || {};
  const stateName = initialData.state?.name || "State";

  document.title = `${stateName} -  Contact Us | Contact`;

  // Add footer with state name
  insertFooter(stateName);

  // Set up form validation
  setupFormValidation();
};

/**
 * Set up contact form validation
 */
const setupFormValidation = () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form fields
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const confirmEmail = document.getElementById("confirmEmail").value.trim();
    const question = document.getElementById("question").value.trim();

    // Reset previous error messages
    removeAllErrorMessages();

    // Validate form
    let isValid = true;

    if (!firstName) {
      displayErrorMessage("firstName", "Please enter your first name");
      isValid = false;
    }

    if (!lastName) {
      displayErrorMessage("lastName", "Please enter your last name");
      isValid = false;
    }

    if (!email) {
      displayErrorMessage("email", "Please enter your email address");
      isValid = false;
    } else if (!isValidEmail(email)) {
      displayErrorMessage("email", "Please enter a valid email address");
      isValid = false;
    }

    if (email !== confirmEmail) {
      displayErrorMessage("confirmEmail", "Email addresses do not match");
      isValid = false;
    }

    if (!question) {
      displayErrorMessage("question", "Please enter your question");
      isValid = false;
    }

    // If form is valid, simulate submission
    if (isValid) {
      // In a real application, you would send the data to a server here
      showSuccessMessage();
      contactForm.reset();
    }
  });
};

/**
 * Check if an email address is valid
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Display an error message for a form field
 * @param {string} fieldId - ID of the field with an error
 * @param {string} message - Error message to display
 */
const displayErrorMessage = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  // Create error message element
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  // Insert after the field
  field.parentNode.insertBefore(errorDiv, field.nextSibling);

  // Add error styling to the field
  field.style.borderColor = "var(--error-border)";
};

/**
 * Remove all error messages from the form
 */
const removeAllErrorMessages = () => {
  // Remove error message elements
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Reset field styling
  document.querySelectorAll("input, textarea").forEach((field) => {
    field.style.borderColor = "var(--form-border)";
  });
};

/**
 * Show success message after form submission
 */
const showSuccessMessage = () => {
  const formContainer = document.getElementById("contactForm").parentNode;

  // Create success message
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent =
    "Thank you for your message! We will get back to you soon.";

  // Add to page
  formContainer.insertBefore(
    successDiv,
    document.getElementById("contactForm")
  );

  // Remove after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
};

// Initialize the page
document.addEventListener("DOMContentLoaded", initializeContactPage);

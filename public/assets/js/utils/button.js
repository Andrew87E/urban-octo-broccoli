/**
 * Initialize Help Button Component
 * Creates and adds the help button and modal to the page
 */
function initializeHelpButton() {
  // Create the button element
  const helpButton = document.createElement("button");
  helpButton.className = "help-button";
  helpButton.setAttribute("aria-label", "Help and Information");
  helpButton.setAttribute("title", "Click for help");
  helpButton.innerHTML = "?";

  // Create the modal
  const helpModal = document.createElement("div");
  helpModal.className = "help-modal";

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "help-modal-content";

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.className = "help-modal-close";
  closeButton.setAttribute("aria-label", "Close help dialog");
  closeButton.innerHTML = "&times;";

  // Create title
  const title = document.createElement("h2");
  title.className = "help-modal-title";
  title.textContent = "Help & Information";

  // Create content
  const content = document.createElement("div");

  // Add help content based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  content.innerHTML = getHelpContentForPage(currentPage);

  // Assemble the modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(content);
  helpModal.appendChild(modalContent);

  // Add everything to the document
  document.body.appendChild(helpButton);
  document.body.appendChild(helpModal);

  // Add event listeners
  helpButton.addEventListener("click", () => {
    helpModal.classList.add("show");
  });

  closeButton.addEventListener("click", () => {
    helpModal.classList.remove("show");
  });

  // Close when clicking outside the modal
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.classList.remove("show");
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpModal.classList.contains("show")) {
      helpModal.classList.remove("show");
    }
  });
}

/**
 * Get help content based on current page
 * @param {string} page - Current page filename
 * @returns {string} HTML content for the help modal
 */
function getHelpContentForPage(page) {
  // Define help content for different pages
  const helpContent = {
    "index.html": `
      <p>Welcome to the State Explorer! This page shows information about your current state based on your location.</p>
      <h3>What You'll Find Here:</h3>
      <ul class="help-modal-list">
        <li><strong>State Overview:</strong> General information about your state.</li>
        <li><strong>Population Data:</strong> Current population statistics.</li>
        <li><strong>Top Cities:</strong> The most populated cities in your state.</li>
        <li><strong>Navigate:</strong> Use the links above to explore the capital and major cities.</li>
      </ul>
      <p>You can toggle between light and dark mode using the 🌓 button in the navigation bar.</p>
    `,

    "capital.html": `
      <p>This page shows information about the capital city of your state.</p>
      <h3>Features Available:</h3>
      <ul class="help-modal-list">
        <li><strong>City Overview:</strong> General information about the capital city.</li>
        <li><strong>Population Data:</strong> Current population statistics.</li>
        <li><strong>Salary Information:</strong> Average salary compared to the state average.</li>
        <li><strong>Capital vs. Non-Capital:</strong> Salary differences between capital and other cities.</li>
      </ul>
      <p>Data is gathered from multiple reliable sources including GeoNames and Wikipedia.</p>
    `,

    "city1.html": `
      <p>This page shows information about one of the major cities in your state.</p>
      <h3>Features Available:</h3>
      <ul class="help-modal-list">
        <li><strong>City Overview:</strong> General information about this city.</li>
        <li><strong>Population Data:</strong> Current population statistics.</li>
        <li><strong>Salary Information:</strong> Average salary compared to the state average.</li>
        <li><strong>Top Cities:</strong> The most populated cities in your state.</li>
      </ul>
      <p>All information is tailored to your current location.</p>
    `,

    "city2.html": `
      <p>This page shows information about another major city in your state.</p>
      <h3>Features Available:</h3>
      <ul class="help-modal-list">
        <li><strong>City Overview:</strong> General information about this city.</li>
        <li><strong>Population Data:</strong> Current population statistics.</li>
        <li><strong>Salary Information:</strong> Average salary compared to the state average.</li>
        <li><strong>Top Cities:</strong> The most populated cities in your state.</li>
      </ul>
      <p>All information is tailored to your current location.</p>
    `,

    "contact.html": `
      <p>Use this page to contact us with questions or feedback.</p>
      <h3>Form Guidelines:</h3>
      <ul class="help-modal-list">
        <li><strong>All fields are required.</strong></li>
        <li><strong>Email confirmation</strong> must match your email address.</li>
        <li><strong>Your question</strong> should be as specific as possible.</li>
      </ul>
      <p>We'll respond to your inquiry as soon as possible.</p>
    `,

    // Default help content if page not recognized
    default: `
      <p>Welcome to the State Explorer!</p>
      <h3>About This App:</h3>
      <ul class="help-modal-list">
        <li><strong>Location-based:</strong> Content is tailored to your current state.</li>
        <li><strong>Real-time Data:</strong> Population and geographic information are current.</li>
        <li><strong>Navigation:</strong> Use the links at the top to explore different cities.</li>
        <li><strong>Theme Toggle:</strong> Switch between light and dark mode with the 🌓 button.</li>
      </ul>
      <p>If you have questions, please visit our Contact page.</p>
    `,
  };

  // Return the appropriate content or the default
  return helpContent[page] || helpContent["default"];
}

// Initialize the help button when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeHelpButton);

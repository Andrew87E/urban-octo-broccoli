// Display loading animation
export const displayLoading = () => {
  $("#loading").css("display", "block");
};

// Hide loading animation
export const hideLoading = () => {
  $("#loading-text").text("Loading");
  $("#loading").css("display", "none");
};

export const updateLoadingText = (text) => {
  $("#loading-text").text(text);
};

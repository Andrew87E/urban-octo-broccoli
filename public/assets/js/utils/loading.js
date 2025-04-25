// Display loading animation
export const displayLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "block";
};

// Hide loading animation
export const hideLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";
};

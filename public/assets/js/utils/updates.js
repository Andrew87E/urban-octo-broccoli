export const updateIntro = async (intro) => {
  const introEl = document.getElementById("intro");
  introEl.textContent = intro;
};

export const updatePhoto = async (photo) => {
  const photoEl = document.getElementById("pic");
  photo = photo.replace(/ /g, "_");
  photoEl.src = photo;
};

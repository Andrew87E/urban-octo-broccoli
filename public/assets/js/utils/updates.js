export const updateIntro = async (intro) => {
  const introEl = document.getElementById("intro");
  introEl.innerHTML = intro;
};

export const updatePhoto = async (photo) => {
  console.log(photo);
  // $(".pic").attr("src", photo);
  const picEl = $(".pic");
  picEl.attr("src", photo);
  console.log(picEl.attr("src"));
};

export const updateIntro = async (intro) => {
  $("#intro").html(intro);
};

export const updatePhoto = async (photo) => {
  $(".pic").attr("src", photo);
};

export const updatePopulation = async (population) => {
  $("#population-count").text(population);
  if (population.includes("Population data not available")) {
    $("#population-count").addClass("text-danger");
  }
};


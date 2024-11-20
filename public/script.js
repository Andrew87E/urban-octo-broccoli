const clearTheForm = () => {
  $("#email").val("");
  $("#confirmEmail").val("");
  $("#firstName").val("");
  $("#lastName").val("");
  $("#question").val("");
  $("#submit").prop("disabled", false);
};

async function validateEmails() {
  const email = $("#email").val();
  const confirmEmail = $("#confirmEmail").val();
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const question = $("#question").val();

  if (email !== confirmEmail) {
    alert("The email addresses do not match. Please try again.");
    return;
  }

  if (firstName === "" || lastName === "" || question === "") {
    alert("Please fill out all fields.");
    return;
  }

  if (!email.includes("@") || !email.includes(".") || email.length < 5) {
    alert("Please enter a valid email address.");
    return;
  }

  if (question.length < 10) {
    alert("Please enter a question that is at least 10 characters long.");
    return;
  }

  // btn-loading
  $("#submit").addClass("btn-loading");
  $("#submit").text("");

  await submitForm(email, firstName, lastName, question);

  // change the class of the submit button back to normal
  $("#submit").removeClass("btn-loading");
  $("#submit").text("Submit");
}

const submitForm = async (email, firstName, lastName, question) => {
  try {
    // sleep for 10 sec to see our loading spinner
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const initialData = localStorage.getItem("initialData") || "No data";

    const res = await fetch("https://www.andrewedwards.dev/api/test/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        fName: firstName,
        lName: lastName,
        question,
        initialData,
      }),
    });

    const data = await res.json();

    if (res.status >= 200 && res.status < 300) {
      console.log(data);
      alert("We have recieved your question! We will get back to you soon.");
      clearTheForm();
    } else if (res.status === 420) {
      console.error(data);
      alert("Please wait a few minutes before submitting another question.");
      clearTheForm();
    } else {
      console.error(data);
      alert("An error occurred. Please try again later.");
      clearTheForm();
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again later.");
    clearTheForm();
  }
};

$("#submit").on("click", validateEmails);

document
  .getElementById("confirmEmail")
  .addEventListener("input", validateEmails);

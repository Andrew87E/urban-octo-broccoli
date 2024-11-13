function validateEmails() {
  const email = document.getElementById("email").value;
  const confirmEmail = document.getElementById("confirmEmail").value;
  if (email !== confirmEmail) {
    alert("The email addresses do not match. Please try again.");
  }
}

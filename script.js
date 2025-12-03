function submitForm() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const mood = document.getElementById("mood").value;

  // Save data
  localStorage.setItem("userName", name);
  localStorage.setItem("userAge", age);
  localStorage.setItem("userMood", mood);

  // Move to result page
  window.location.href = "result.html";
}

function loadResult() {
  const name = localStorage.getItem("userName");
  const age = localStorage.getItem("userAge");
  const mood = localStorage.getItem("userMood");

  document.getElementById("resultText").innerHTML = `
    <h2>Hello ${name}!</h2>
    <p>Your current mood: <b>${mood}</b></p>
    <p>Based on your age (${age}), your future looks <b>very bright</b>!</p>
  `;
}
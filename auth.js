const API_URL = "https://script.google.com/macros/s/AKfycbxjgQ-bTjCOeqwexKX10NqBCWQ3CE5eiW9tmpCwIZlvQw2vdzhQOIc4whYPSPw6pc2XcA/exec";

function login() {

  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;

  if (!name || !mobile) {
    alert("Please enter details");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      name,
      mobile
    })
  })
  .then(res => res.json())
  .then(data => {

    console.log("LOGIN DATA:", data);

    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", name);

    alert("Login successful ✅");

    window.location.href = "index.html"; // 🔥 redirect

  })
  .catch(err => {
    console.error(err);
    alert("Login failed ❌");
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const authDiv = document.getElementById("authSection");
  if (!authDiv) return;

  const userName = localStorage.getItem("userName");

  if (userName) {
    // ✅ Logged in
    authDiv.innerHTML = `
      <span style="margin-right:10px;">Hi, ${userName}</span>
      <button onclick="logout()" class="auth-btn">Logout</button>
    `;
  } else {
    // ❌ Not logged in
    authDiv.innerHTML = `
      <button onclick="goLogin()" class="auth-btn">Login</button>
    `;
  }

});

function goLogin() {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");

  alert("Logged out successfully");

  window.location.href = "index.html";
}

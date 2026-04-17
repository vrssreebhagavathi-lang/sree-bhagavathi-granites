const API_URL = "https://script.google.com/macros/s/AKfycbxjgQ-bTjCOeqwexKX10NqBCWQ3CE5eiW9tmpCwIZlvQw2vdzhQOIc4whYPSPw6pc2XcA/exec";

const userId = localStorage.getItem("userId");

if (!userId) {
  alert("Please login first");
  window.location.href = "login.html";
}

function loadWishlist() {
  fetch(`${API_URL}?type=wishlist&userId=${userId}`)
  .then(res => res.json())
  .then(data => {

    const grid = document.getElementById("wishlistGrid");
    grid.innerHTML = "";

    if (data.length === 0) {
      grid.innerHTML = "<p>No items in wishlist</p>";
      return;
    }

    data.forEach(item => {
      grid.innerHTML += `
        <div class="product-card">
          <img src="${item.image}">
          <h3>${item.name}</h3>
          <p>₹ ${item.price}</p>

          <button onclick="removeItem('${item.name}')">
            ❌ Remove
          </button>
        </div>
      `;
    });

  });
}

function removeItem(productName) {

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "removeWishlist",
      userId: userId,
      productName: productName
    })
  })
  .then(() => {
    alert("Removed from wishlist ❌");
    loadWishlist(); // refresh UI
  });
}

loadWishlist();

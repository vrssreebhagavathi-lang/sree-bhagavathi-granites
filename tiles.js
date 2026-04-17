const API_URL = "https://script.google.com/macros/s/AKfycbxjgQ-bTjCOeqwexKX10NqBCWQ3CE5eiW9tmpCwIZlvQw2vdzhQOIc4whYPSPw6pc2XcA/exec";
let allProducts = [];
let userWishlist = [];
async function loadData(){

console.log("Products:", allProducts);
console.log("Wishlist:", userWishlist);

try{

let res = await fetch(API_URL + "?sheet=Tiles");
let data = await res.json();

console.log("DATA:", data); // debug

// ✅ SAFE CLEANING
allProducts = data.map(p => ({
brand: String(p.brand || p.Brand || "").trim(),
size: String(p.size || p.Size || "").trim(),
application: String(p.application || p.Application || "").trim(),
name: String(p.name || p.Name || "").trim(),
image: String(p.image || p.Image || "").trim(),
description: String(p.description || p.Description || "").trim(),
price: p.price || p.Price || ""
}));

await loadUserWishlist();   // 🔥 ADD THIS LINE
updateWishlistCount();
loadFilters(allProducts);
setTimeout(() => {
  displayProducts(allProducts);
}, 100);


}catch(err){
console.error("ERROR:", err);
}

}

loadData();

function loadFilters(data){

let brands = new Set();
let sizes = new Set();
let apps = new Set();

data.forEach(item => {
brands.add(item.brand);
sizes.add(item.size);
apps.add(item.application);
});

fillDropdown("brandFilter", brands);
fillDropdown("sizeFilter", sizes);
fillDropdown("appFilter", apps);

}

function fillDropdown(id, values){

let select = document.getElementById(id);

values.forEach(val => {
let option = document.createElement("option");
option.value = val;
option.textContent = val;
select.appendChild(option);
});

}

document.getElementById("brandFilter").addEventListener("change", filterProducts);
document.getElementById("sizeFilter").addEventListener("change", filterProducts);
document.getElementById("appFilter").addEventListener("change", filterProducts);

function filterProducts(){

let brand = document.getElementById("brandFilter").value;
let size = document.getElementById("sizeFilter").value;
let app = document.getElementById("appFilter").value;

let filtered = allProducts.filter(p => {

return (!brand || p.brand === brand) &&
(!size || p.size === size) &&
(!app || p.application === app);

});

displayProducts(filtered);

}

function displayProducts(products){

let grid = document.getElementById("productGrid");
grid.innerHTML = "";

products.forEach(p => {

grid.innerHTML += `
<div class="product-card" onclick='openPopup(${JSON.stringify(p)})'>

<div class="heart-icon ${userWishlist && userWishlist.includes(p.name) ? 'active' : ''}"
onclick='event.stopPropagation(); toggleWishlist(${JSON.stringify(p)})'>
❤️
</div>

<img src="${p.image}">
<h3>${p.name}</h3>
<p>₹ ${p.price}</p>

</div>
`;
});

}

function clearFilters(){

document.getElementById("brandFilter").value = "";
document.getElementById("sizeFilter").value = "";
document.getElementById("appFilter").value = "";

setTimeout(() => {
  displayProducts(allProducts);
}, 100);

}




function closePopup(){
document.getElementById("productPopup").style.display = "none";
}

let selectedProduct = null;

function openPopup(product){

selectedProduct = product;

document.getElementById("productPopup").style.display = "flex";

document.getElementById("popupImage").src = product.image;
document.getElementById("popupName").innerText = product.name;
document.getElementById("popupDesc").innerText = product.description;
document.getElementById("popupPrice").innerText = "₹ " + product.price;

}

function updateWishlistCount(){

let countElement = document.getElementById("wishlistCount");

if(countElement){
countElement.innerText = userWishlist.length;
}

}







function addToWishlist(product) {

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "wishlist",
      userId: userId,
      productName: product.name,
      image: product.image,
      price: product.price
    })
  })
    .then(res => res.json())
    .then(data => {

      if (data.status === "exists") {
        alert("Already in wishlist ❤️");
      } else {
        alert("Added to Wishlist ❤️");
      }

    });
}


async function loadUserWishlist() {

  const userId = localStorage.getItem("userId");

  if (!userId) return;

  try {
    let res = await fetch(API_URL + "?type=wishlist&userId=" + userId);
    let data = await res.json();

    userWishlist = data.map(item => item.name);

  } catch (err) {
    console.error("Wishlist load error:", err);
  }

}

function isWishlisted(product) {
  if (!Array.isArray(userWishlist)) return false;
  return userWishlist.includes(product.name);
}

function toggleWishlist(product) {

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const isAdded = userWishlist.includes(product.name);

  const action = isAdded ? "removeWishlist" : "wishlist";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: action,
      userId: userId,
      productName: product.name,
      image: product.image,
      price: product.price
    })
  })
  .then(() => {

    if (isAdded) {
      userWishlist = userWishlist.filter(n => n !== product.name);
    } else {
      userWishlist.push(product.name);
    }

    setTimeout(() => {
        displayProducts(allProducts);
    }, 100);

  });
}

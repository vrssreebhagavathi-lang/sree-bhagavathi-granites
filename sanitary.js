const API = "https://script.google.com/macros/s/AKfycby3QiUF6G93Gtbd1Gl-g2PJZIi9nr89Q9wlNGg1XBlt0J8JnJFcdtAWZG9hbMGQ5ZAWPQ/exec?sheet=Sanitary";

let allProducts = [];

async function loadData(){

try{

let res = await fetch(API);
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

loadFilters(allProducts);
displayProducts(allProducts);
updateWishlistCount();

}catch(err){
console.error("ERROR:", err);
}

}

loadData();

function loadFilters(data){

let brands = new Set();
let categories = new Set();

data.forEach(item => {
brands.add(item.brand);
categories.add(item.category);
});

fillDropdown("brandFilter", brands);
fillDropdown("categoryFilter", categories);

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
document.getElementById("categoryFilter").addEventListener("change", filterProducts);

function filterProducts(){

let brand = document.getElementById("brandFilter").value;
let category = document.getElementById("categoryFilter").value;

let filtered = allProducts.filter(p => {

return (!brand || p.brand === brand) &&
(!category || p.category === category);

});

displayProducts(filtered);

}

function displayProducts(products){

let grid = document.getElementById("productGrid");
grid.innerHTML = "";

products.forEach(p => {

grid.innerHTML += `
<div class="product-card" onclick='openPopup(${JSON.stringify(p)})'>

<div class="heart-icon ${isWishlisted(p) ? 'active' : ''}" 
onclick='toggleWishlist(event, ${JSON.stringify(p)})'>
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
document.getElementById("categoryFilter").value = "";

displayProducts(allProducts);

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


function addToWishlist(){

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// check duplicate
let exists = wishlist.some(item => item.name === selectedProduct.name);

if(exists){
alert("Already in Wishlist ❤️");
return;
}

wishlist.push(selectedProduct);

localStorage.setItem("wishlist", JSON.stringify(wishlist));

updateWishlistCount();

alert("Added to Wishlist ❤️");

}

function updateWishlistCount(){

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let countElement = document.getElementById("wishlistCount");

if(countElement){
countElement.innerText = wishlist.length;
}

}

updateWishlistCount();


function getWishlist(){
return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function isWishlisted(product){

let wishlist = getWishlist();

return wishlist.some(item => item.name === product.name);

}


function toggleWishlist(event, product){

event.stopPropagation(); // prevent popup opening

let wishlist = getWishlist();

let index = wishlist.findIndex(item => item.name === product.name);

if(index > -1){

// remove
wishlist.splice(index,1);

}else{

// add
wishlist.push(product);

}

localStorage.setItem("wishlist", JSON.stringify(wishlist));

updateWishlistCount();

// refresh UI
displayProducts(allProducts);

}

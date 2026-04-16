let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

displayWishlist();

function displayWishlist(){

let grid = document.getElementById("wishlistGrid");
grid.innerHTML = "";

if(wishlist.length === 0){
grid.innerHTML = "<p>No items in wishlist</p>";
return;
}

wishlist.forEach((item, index) => {

grid.innerHTML += `

<div class="product-card">
<img src="${item.image}">
<h3>${item.name}</h3>
<p>₹ ${item.price}</p>

<button onclick="removeItem(${index})" class="view-btn">
Remove
</button>

</div>
`;

});

}

function removeItem(index){

wishlist.splice(index,1);

localStorage.setItem("wishlist", JSON.stringify(wishlist));

displayWishlist();
updateWishlistCount();

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

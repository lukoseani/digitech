
document.addEventListener('DOMContentLoaded', function() {
const addToCartButton = document.getElementById("myAddToCart");
console.log(addToCartButton)
addToCartButton.addEventListener("click",function(){

const productId = document.getElementById("productId").value;
addToCart(productId)
})
});

async function addToCart(productId) {
  try {
    const response = await fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({
        productId,
      })


    })
    if (response.ok) {

      console.log("product has been added to the cart");
      window.location.href = "/products";
    }
    else if(response.status == 400){
      alert("Please Login to your account to perform this action");
      window.location.href = "/users/login";
    }
    else{
      alert("Failed to add the product to the cart, try again later");
      window.location.href = "/products";
    }
  }
  catch (error) {
    console.error(error);
  }
}



//product details page script

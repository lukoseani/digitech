
  //products page script
  document.addEventListener('DOMContentLoaded', function() {
  const productGrid = document.querySelector('.products-grid');
  productGrid.addEventListener("click",function(event){
    const targetButton = event.target.closest('.seeDetails');
    if(targetButton){
    event.preventDefault();
    const productId = targetButton.parentElement.querySelector('.productId').value;
    seeDetails(productId);
    }
  
    });
  
  // const detailsButtons = document.querySelectorAll(".seeDetails");
  // detailsButtons.forEach((button)=>{
  // button.addEventListener("click",function(event){
  // event.preventDefault();
  // const productId = button.previousElementSibling.value;
  // seeDetails(productId);

  // });
// })
   
  });

  async function seeDetails(productId){
    
    window.location.href = `/products/${productId}`;
  }

  document.getElementById('sortButton').addEventListener("click",function(){
    sortByPrice();
  })

  async function sortByPrice(){
    try {
      const response = await fetch('/products/sort', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (response.ok) {
        // Handle success
        const sortedProduct = await response.json();
        displayProducts(sortedProduct);
      } else {
        // Handle failure
        console.error('Failed to sort');
      }
    } catch (error) {
      console.error(error);
    }
    }

    function displayProducts(products) {
      // Clear existing product grid
      const productsGrid = document.querySelector('.products-grid');
      productsGrid.innerHTML = '';
    
      // Display the sorted products
      products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-div');
    
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-div');
        imageDiv.innerHTML = `<img src="${product.image}" class="product-img">`;
        productDiv.appendChild(imageDiv);
    
        const productDetailsDiv = document.createElement('div');
        productDetailsDiv.classList.add('product-details');
        productDetailsDiv.innerHTML = `
          <div class="product-name">${product.name}</div>
          <div class="product-name">$${product.price}</div>
          <div class="button-div">
            <input type="hidden" name="productId" class="productId" value="${product._id}">
            <button class="btn details-button seeDetails" type="button">See details</button>
          </div>`;
        productDiv.appendChild(productDetailsDiv);
    
        productsGrid.appendChild(productDiv);
      });
    }
    
    
  

  
  
 
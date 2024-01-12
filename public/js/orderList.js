   //change order status

   document.addEventListener('DOMContentLoaded', function() {

    const formElements = document.querySelectorAll("#change-status-form")
    
        formElements.forEach((formElement)=>{
          formElement.addEventListener("submit",function(event){
           event.preventDefault(); 
           const orderId = formElement.querySelector("#orderId").value;
           const status = formElement.querySelector("#newStatus").value;
           changeStatus(orderId,status)
          })
        })
    
    
       async function changeStatus(orderId,status) {
        const confirm = window.confirm(`Are you sure want to change order status`);
        const storedToken = localStorage.getItem('bearerToken');
        
       if(confirm && status){
        try {
          const response = await fetch('/admin/orders/changeStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
              orderId,
              status
             
            })
          });
    
          if (response.ok) {
            // Handle success
            window.location.href = '/admin/orders';
          } else {
            // Handle failure
            console.error('Failed to update user status');
          }
        } catch (error) {
          console.error(error);
        }
      }
      }
    
    });
    
    
      //cancel product
      document.addEventListener('DOMContentLoaded', function() {
    
      const formElements = document.querySelectorAll("#cancel-form")
      
      
      formElements.forEach((formElement)=>{
        formElement.addEventListener("submit",function(event){
        event.preventDefault();
        const orderId = formElement.querySelector("#orderId").value;
        cancelOrder(orderId);
    
      })
      })
    
      async function cancelOrder(orderId){
    
    const confirm = window.confirm(`Are you sure want to cancel this order`);
    const storedToken = localStorage.getItem('bearerToken');
    
    if(confirm){
    try {
      const response = await fetch('/admin/orders/cancelOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          orderId,
          
         
        })
      });
    
      if (response.ok) {
        // Handle success
        window.location.href = '/admin/orders';
      } else {
        // Handle failure
        console.error('Failed to cancel order');
      }
    } catch (error) {
      console.error(error);
    }
    }
    
    }
    
    })
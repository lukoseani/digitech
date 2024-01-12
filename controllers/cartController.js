import {Cart} from '../models/cart.js';
import {User} from '../models/users.js';
import {Product} from '../models/product.js';
import {CartItem} from '../models/cart-item.js';
import createPay from '../helpers/create-pay.js';
import paypal from 'paypal-rest-sdk';






paypal.configure({
  mode:'sandbox',
  client_id : process.env.PAYPAL_CLIENT_ID,
  client_secret : process.env.PAYPAL_CLIENT_SECRET,
})



//get cart item
const getCart = (req,res)=>{
  res.render("cart.ejs",{product:req.session.cart,user:req.session.user});
}

//delete item from cart
const deleteCartItem = (req,res)=>{
  const index = req.body.index;
  req.session.cart.splice(index,1);
  res.status(200).json({message:"Item has been deleted"});
}


//increment cart quantity

const incrementCartQuantity = (req,res)=>{
  const index = req.params.index;
  req.session.cart[index].quantity += 1;
  res.redirect("/cart"); 
}

//decrement Cart Quantity

const decrementCartQuantity = (req,res)=>{
  const index = req.params.index;
  if(req.session.cart[index].quantity > 1){
  req.session.cart[index].quantity -= 1;
  }
  res.redirect("/cart"); 
}


//add Item to the cart
const addItemToCart = async(req,res)=>{
  const productId = req.body.productId;
  let flag = false;
  const product = await Product.findById(productId);
  req.session.cart = req.session.cart || [];
    if(req.session.cart){
      req.session.cart.forEach(product=>{
        if(product._id === productId){
          flag = true;
          
        }
      })
    }

    if(flag === true){
      return res.status(200).json({message:"item is already in the cart"});
    }
    else{

  req.session.cart.push(product);
  return res.status(200).json({message:"item has been added to the cart"});
    }
  }
  
//add shipping address

const addShippingAddress = async(req,res)=>{
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('address');
  const address = user.address;
  const phone = user.phone;
  const name = user.name
  res.render("checkout-address.ejs",{address:address,name:name,phone:phone});
}


//checkout with adding shipping address

const checkout = (req,res)=>{


  const addressOption = req.body.addressOption;
  console.log(addressOption);

  if(!addressOption){
      req.flash('error', 'Choose appropriate option');
      res.locals.message = req.flash();
      return res.redirect('/cart/add-address');
  }
  let existingAddress,newAddress;
  // Add existing address
  if (addressOption === 'existing') {
    existingAddress = {
      name:req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      province: req.body.province,
      postalcode: req.body.postalcode,
      phone:req.body.phone,
      
    };
    
    // Add new address...
  } else if (addressOption === 'new') {

    // if(!req.body.newName ||!req.body.newAddressLine1 || !req.body.newCity || !req.body.newProvince || !req.body.newPostalcode || !req.body.newPhone || !req.body.newCountry){
    //   req.flash('error', 'All fields are mandatory.');
    //   res.locals.message = req.flash();
    //   return res.redirect('/cart/add-address');
    // }
    newAddress = {
      name:req.body.newName,
      addressLine1: req.body.newAddressLine1,
      addressLine2: req.body.newAddressLine2,
      city: req.body.newCity,
      province: req.body.newProvince,
      postalcode: req.body.newPostalcode,
      phone:req.body.newPhone,
      
    };
  }

  console.log(newAddress);
  
 
 req.session.address = existingAddress ? existingAddress : newAddress;
 const address = existingAddress ? existingAddress : newAddress;
 return res.render("checkout.ejs",{paypalClientId:process.env.PAYPAL_CLIENT_ID,address:address,item:req.session.cart});

}




const paypalCheckout = async(req,res)=>{

  

 


  try {

    //items for payment


    const items = [];

    req.session.cart.forEach(item=>{
     const paypalItem = {
        "name":item.name,
        "sku":item._id,
        "price":item.price,
        "currency":"CAD",
        "quantity":item.quantity,
        
      }
      items.push(paypalItem);
    })

    

    
    let totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    

    

    const amount = {
        "currency": "CAD", //currency
        "total": totalAmount.toFixed(2) //total amount
    }


    // Creating a payment data object

    const paymentData = {

        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/cart/paypalsuccess", // if sucessfull return url
            "cancel_url": "http://localhost:4000/cart/paypalcancel" // if canceled return url
        },
        "transactions": [{
            "item_list": {
                "items": items // the items
            },
            "amount": amount, // the amount
            "description": "Payment using PayPal"
        }]

    }

   
    // creating payment 
    paypal.payment.create(paymentData, function (err, payment) {
        if (err) {
          throw err;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href)
            }
          }
        }
      })




} catch (error) {

}
}

//paypal success page

const handlePayment = async(req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const executePayment = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, executePayment, async(error, payment) => {
    if (error) {
      console.error('Error executing PayPal payment:', error);
      res.redirect('/paypalcancel');
    } else {

      const cartItemsIds = Promise.all(req.session.cart.map(async cartItem=>{
    
        let newCartItem = new CartItem({
          quantity:cartItem.quantity,
          product:cartItem._id,
        })
        newCartItem = await newCartItem.save();
    
        return newCartItem._id
      }))
    const user = await User.findById(req.session.user._id);
    const cartItemsIdsResolved = await cartItemsIds;
    
    function generateOrderNumber() {
      const timestamp = Date.now().toString(); // Use a timestamp as the base
      const random = Math.floor(Math.random() * 1000).toString(); // Add a random component
    
      const orderNumber = timestamp + random;
      return orderNumber;
    }
    
    const totalPrices = await Promise.all(cartItemsIdsResolved.map(async cartItemId=>{
      const cartItem = await CartItem.findById(cartItemId).populate('product');
      const totalPrice = cartItem.product.price * cartItem.quantity;
      return totalPrice;
    }))
    
    const total = totalPrices.reduce((a,b)=>a+b,0);
    const tax = total * 0.05;
    const shipping = 20;
    const totalPrice = total +shipping+ tax;
    
    
    
     let cart = new Cart({
      cartItems:cartItemsIdsResolved,
      name:req.session.name,
      shippingAddress1:req.session.address.addressLine1,
      shippingAddress2:req.session.address.addressLine2,
      city:req.session.address.city,
      province : req.session.address.province,
      postalcode: req.session.address.postalcode,
      phone:req.session.address.phone,
      totalPrice:"7800",
      user: user._id,
      orderNumber:generateOrderNumber(),
      totalPrice:totalPrice,
     })
     
    
     cart = await cart.save();
     if(!cart){
      return res.status(404).json({message:"order can not be created"});
     }
      
      
      req.session.cart = [];
      res.render("order-confirm.ejs");
      
      //res.send('Payment Success'); 
    }
  });
}






//confirm order

const confirmOrder = async(req,res)=>{

  const cartItemsIds = Promise.all(req.session.cart.map(async cartItem=>{
    
    let newCartItem = new CartItem({
      quantity:cartItem.quantity,
      product:cartItem._id,
    })
    newCartItem = await newCartItem.save();

    return newCartItem._id
  }))
const user = await User.findById(req.session.user._id);
const cartItemsIdsResolved = await cartItemsIds;

function generateOrderNumber() {
  const timestamp = Date.now().toString(); // Use a timestamp as the base
  const random = Math.floor(Math.random() * 1000).toString(); // Add a random component

  const orderNumber = timestamp + random;
  return orderNumber;
}

const totalPrices = await Promise.all(cartItemsIdsResolved.map(async cartItemId=>{
  const cartItem = await CartItem.findById(cartItemId).populate('product');
  const totalPrice = cartItem.product.price * cartItem.quantity;
  return totalPrice;
}))

const total = totalPrices.reduce((a,b)=>a+b,0);
const tax = total * 0.05;
const shipping = 20;
const totalPrice = total +shipping+ tax;



 let cart = new Cart({
  cartItems:cartItemsIdsResolved,
  name:req.session.name,
  shippingAddress1:req.session.address.addressLine1,
  shippingAddress2:req.session.address.addressLine2,
  city:req.session.address.city,
  province : req.session.address.province,
  postalcode: req.session.address.postalcode,
  phone:req.session.address.phone,
  totalPrice:"7800",
  user: user._id,
  orderNumber:generateOrderNumber(),
  totalPrice:totalPrice,
 })
 

 cart = await cart.save();
 if(!cart){
  return res.status(404).json({message:"order can not be created"});
 }
  
  
  req.session.cart = [];
  res.render("order-confirm.ejs");

}

//cancel order

const cancelOrder = async(req,res)=>{
  const {orderId} = req.body;
  
  const status = "cancelled";
  try{
  const order = await Cart.findByIdAndUpdate(orderId,{status:status},{new:true});
  
  if(!order){
    return res.status(500).json({message:"Error while cancelling the order"});
  }
  res.status(200).json({message:"order has been cancelled"});
}
catch(error){
  console.log(error);
}
}

export {getCart,deleteCartItem,incrementCartQuantity,decrementCartQuantity,addItemToCart,checkout,confirmOrder,cancelOrder,addShippingAddress,paypalCheckout,handlePayment};
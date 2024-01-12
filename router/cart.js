import express from 'express';
import {getCart,deleteCartItem,incrementCartQuantity,decrementCartQuantity,addItemToCart,checkout,confirmOrder,cancelOrder,addShippingAddress,paypalCheckout,handlePayment} from '../controllers/cartController.js';

const router = express.Router();

//client side cart

router.get('/',getCart);

//delete item from cart
router.post('/delete',deleteCartItem);

//increment cart quantity
router.post('/increment/:index',incrementCartQuantity);

//decrement cart quantity
router.post('/decrement/:index',decrementCartQuantity);


router.get('/add-address',addShippingAddress);

//checkout with adding shipping address

router.post('/checkout',checkout)


//add item to the cart
router.post('/',addItemToCart)

//paypal 
router.get('/create-paypal-order',paypalCheckout);

router.get('/paypalsuccess',handlePayment);

router.get('/paypalcancel',(req,res)=>{
  res.send('failed');
})

router.get('/success',(req,res)=>{
  console.log(req.query);
  res.redirect('/success');
})

router.get('/err',(req,res)=>{
  console.log(req.query);
  res.redirect('/err');
})


//get confirm order
router.get('/confirm-order',confirmOrder);

//user changes order status to cancel
router.post('/cancel-order',cancelOrder)

export default router;
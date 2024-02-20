import express from 'express';
import {checkSession} from '../helpers/session-handler.js';
import {getCart,deleteCartItem,incrementCartQuantity,decrementCartQuantity,addItemToCart,checkout,confirmOrder,cancelOrder,addShippingAddress,paypalCheckout,handlePayment} from '../controllers/cartController.js';

const router = express.Router();

//client side cart

router.get('/',checkSession,getCart);

//delete item from cart
router.post('/delete',checkSession,deleteCartItem);

//increment cart quantity
router.post('/increment/:index',incrementCartQuantity);

//decrement cart quantity
router.post('/decrement/:index',decrementCartQuantity);


router.get('/add-address',checkSession,addShippingAddress);

//checkout with adding shipping address

router.post('/checkout',checkSession,checkout)


//add item to the cart
router.post('/',checkSession,addItemToCart)

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
router.get('/confirm-order',checkSession,confirmOrder);

//user changes order status to cancel
router.post('/cancel-order',checkSession,cancelOrder)

export default router;
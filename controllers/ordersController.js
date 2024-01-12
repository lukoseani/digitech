import {Cart} from '../models/cart.js';

const getOrderList = async(req,res)=>{
const orders = await Cart.find({});
res.render("orderList.ejs",{orders:orders});
}

const changeOrderStatus = async(req,res)=>{
const orderId = req.body.orderId;
const status = req.body.status;
const order =await Cart.findByIdAndUpdate(orderId,{status:status},{new:true});
if(!order){
  res.status(400).json({message:"cannot update order status"});
}
res.status(200).json({message:"status has been changed"});
}

const cancelOrder = async(req,res)=>{
  const orderId = req.body.orderId;
  const order = await Cart.findByIdAndUpdate(orderId,{status:"Cancelled"},{new:true});

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(200).json({ message: 'Order cancelled successfully' });
}



export {getOrderList,changeOrderStatus,cancelOrder};
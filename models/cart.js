import mongoose from "mongoose";

const cartSchema = mongoose.Schema({

  cartItems:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'CartItem',
    required:true,
}],
name:{
  type:String,
},
 shippingAddress1:{
  type:String,
  required:true,
 },
 shippingAddress2:{
  type:String,
 },
 city:{
  type:String,
  required:true,
 },
 province:{
  type:String,
  required:true,
 },
 postalcode:{
  type:String,
  required:true,
 },
 phone:{
  type:String,
  required:true,
 },
 merchandise:{
  type:Number,
  default:'',
 },
 shipping:{
  type:Number,
  default:''
 },
 tax:{
  type:Number,
  default:'',
 },
 totalPrice:{
  type:Number,
  default:'',
},
paymentMethod:{
  type:String,
  default:'',
},
status:{
  type:String,
  default:'Pending',
},
dateOrdered:{
  type:Date,
  default:Date.now,
},
orderNumber:{
  type:Number,
  default:'',
},
user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User',
}
})

cartSchema.virtual("id").get(function(){
  return this._id.toHexString();
})

cartSchema.get('toJSON',{
  virtuals:true
})

const Cart = mongoose.model('Cart',cartSchema);
export {Cart}
import mongoose from 'mongoose';
import {Address} from '../models/address.js';



const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHashed: {
    type: String,
    required: true,
  },
  address: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Address',
    
    
  },

  phone: {
    type:Number,
    required:true,
  },
  isAdmin: {
    type:Boolean,
    default:false,
  },
  isBlocked: {
    type:Boolean,
    default:false,
  },
  // role:{
  //   type: String,
  //   enum:['user','admin'],
  //   default:'user',
  // }
  
});



const User = mongoose.model('User',userSchema);

export {User};
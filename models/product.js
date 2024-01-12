import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  
name: {
  type: String,
  required: true,
},
brand:{
  type: String, //brand collection
  required: true,
},


price: {
  type: Number,
  default: 0,
  },
  
  quantity:{
    type:Number,
    default:1,
  },

image: {
  type: String,
  default: '',
  },
images: [{
  type: String,
  default: '',
  }],
productDetails: {
  type: String,
  required: true,
  },
category: {
  
  type: mongoose.Schema.Types.ObjectId,
  ref:'Category',
  required: true,
},
countInStock: {
  type: Number,
  required: true,
},
isFeatured: {
  type: Boolean,
  default: false,
},
dateCreated: { 
  type: Date,
  default: Date.now,
}

})

const Product = mongoose.model('Product',productSchema);
export {Product};
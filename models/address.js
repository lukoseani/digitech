import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
  unit:{
    type: String,
    
  },
  addressLine1: {
    type: String,
    
  },
  addressLine2:{
    type: String,
    
  },
  city: {
    type: String,
    
  },
  province: {
    type: String,
    
  },
  country: {
    type: String,
    
  },
  postalcode: {
    type: String,
    
  },

});

const Address = mongoose.model('Address',addressSchema);

export {Address};
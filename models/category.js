import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  image: {
    type: String,
  }
  
});

categorySchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

categorySchema.set('toJSON', {
  virtuals: true,
});


const Category = mongoose.model('Category',categorySchema);
export {Category};
import express from 'express';
const router = express.Router();
import {Product} from '../models/product.js';
import {User} from '../models/users.js';
import {Category} from '../models/category.js';
import mongoose from 'mongoose';
import multer from 'multer';
import generateNonce from '../helpers/generateNonce.js'
import { getUserProducts,getProductsSortedByPrice } from '../controllers/productController.js';


const FILE_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',

}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if(isValid){
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
})

const uploadOptions = multer({ storage: storage })








//get all the products with the category document or the category products if query params passed

router.get(`/`,getUserProducts);

//get sorted product

router.get('/sort',getProductsSortedByPrice);

// get a single product

router.get('/:id',async(req,res)=>{
  const product = await Product.findById(req.params.id);
  if(!product){
    res.status(500).json({success:false});
  }
  let user = req.session.user;
  res.render("product-details.ejs",{item:product,user:user});
})

// get total product count

router.get('/get/count',async(req,res)=>{
  const productCount = await Product.countDocuments();
  if(!productCount){
    res.status(500).json({success:false});
  }
  res.json({count:productCount});
})

// get featured product

router.get('/featured/:count',async(req,res)=>{
  console.log(req.params.count);
const count = req.params.count?req.params.count:0;
const featured = await Product.find({isFeatured:true}).limit(+count);
if(!featured){
  res.json({success:false, message:"Featured products not found"});
}
res.json(featured);
});




// add a product

router.post(`/`,uploadOptions.single('image'),async(req,res)=>{

  const category = await Category.findById(req.body.category);
 
  const basepath = `${req.protocol}://${req.get('host')}`;
  console.log(req.file);
  const fileName = req.file.filename;
  console.log(req.file);
  if(!category){
    res.status(500).send('Category doesnt exist');
  }
  let product = new Product({
    
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    image: `${basepath}${fileName}`,
    images: req.body.images,
    productDetails: req.body.productDetails,
    category: req.body.category,
    countInStock: req.body.countInStock,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,

  })

  product = await product.save();
  if(!product){
    res.status(500).json({success:false,message: "cannot add the data"});
  }
  res.json(product);


});




router.put('/:id',async(req,res)=>{
if(mongoose.isValidObjectId(req.params.id));


  const category = await Category.findById(req.body.category);
  if(!category){
    res.status(500).send('Category doesnt exist');
  } 

  const product = {
    name: req.body.name,
    brand: req.body.brand,
    rating: req.body.rating,
    review: req.body.review,
    price: req.body.price,
    quantity: req.body.quantity,
    images: req.body.images,
    productDetails: req.body.productDetails,
    category: req.body.category,
    countInStock: req.body.countInStock,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  }
  const updatedResult = await Product.findByIdAndUpdate(req.params.id,product,
    {new:true});
  if(!updatedResult){
  res.status(404).json({success:false, message : "failed to update"});
  }
  console.log(`Router ${updatedResult}`);
  res.json(updatedResult);

})

router.put('/gallery-images/:id',uploadOptions.array('images',10),async(req,res)=>{
  try{
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send('Invalid product id');
  }
  
  
  const files = req.files;
  let imagesPaths = [];
  const basepath = `${req.protocol}://${req.get('host')}/public/uploads`;

  if(files){
    files.map(file=>{
      imagesPaths.push(`${basepath}/${file.filename}`);
    })
  }

  console.log(imagesPaths);
  
    const product  = await Product.findByIdAndUpdate(req.params.id,{
      images:imagesPaths
    },
      {new:true});

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product cannot be updated' });
      }
  
      return res.send(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

  })
export default router;
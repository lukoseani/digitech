import {Category} from '../models/category.js';
import {Product} from '../models/product.js';

//get user products

const getUserProducts = async(req,res)=>{

  let user = req.session.user;
  
  let filter = {};
  if(req.query.categories){
    filter = {category:{$in:req.query.categories.split(',')}};
  }
  
  
  const products = await Product.find(filter).populate('category');
  
  
  res.render("products.ejs",{items:products,user:user}); 
  
}

//add Product view

const addProductView = async(req,res)=>{

  const categories = await Category.find();
  res.render("add-product.ejs",{title:"Add-Product",categories:categories});
}

//get update product view

const updateProductView = async(req,res)=>{
  const productId = req.query.productId;
  const product = await Product.findById(productId);
   const categories = await Category.find();
   const category = await Category.findById(product.category);
   const categoryName = category.name;
  
   res.render("update-product.ejs",{item:product,category:categoryName,categories:categories});
 }

 const getProducts = async(req,res)=>{

  let filter = {};
  if(req.query.categories){
    filter = {category:{$in:req.query.categories.split(',')}};
  }
  
  
  const products = await Product.find(filter).populate('category');
  res.render("admin-products.ejs",{items:products}); 

  
}


//add product 

const addProduct = async(req,res)=>{
    
  console.log("hit server side");
  
  const category = await Category.findById(req.body.category);
  

 
  if(!category){
    res.status(500).send('Category doesnt exist');
  }

  const file = req.files[0];
  

  if(!file){
    return res.status(500).send('file doesnt exist');
  }
  
  const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const fileName = file.filename ? file.filename : null;
  
  
const imagePaths = [];
const files = req.files;



if(files){
  const filesToUpload = files.slice(1);
  filesToUpload.map(file=>{  
    imagePaths.push(`${basepath}${file.filename}`);
  })
}
 

 let product = new Product({
    
    name: req.body.name,
    itemNo: req.body.itemNo,
    modelNumber: req.body.modelNumber,
    brand: req.body.brand,
    price: req.body.price,
    quantity: req.body.qty,
    image: `${basepath}${fileName}`,
    images: imagePaths,
    productDetails: req.body.productDetails,
    category: category,
    countInStock: req.body.countInStock,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,

})

product = await product.save();
if(!product){
  console.log("can't add product");
res.status(500).json({success:false,message: "cannot add the data"});
}
console.log("item has been added");
res.status(200).json({message:"item has been added"});
}


//update product 

const updateProduct = async(req,res)=>{
  const id = req.body.productId;
  const category = await Category.findById(req.body.category);
  
  
 
  if(!category){
    res.status(500).send('Category doesnt exist');
  }
  
const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;


const imagePaths = [];
const files = req.files;



if(files){
  files.map(file=>{
    imagePaths.push(`${basepath}${file.filename}`);
  })
}




let product = {};
  
product.name = req.body.name;
product.brand = req.body.brand,
product.price = req.body.price;
product.images = imagePaths;
product.productDetails = req.body.productDetails;
product.category = category;
product.countInStock = req.body.countInStock;
product.isFeatured = req.body.isFeatured;
product.dateCreated = req.body.dateCreated;


const updatedProduct = await Product.findByIdAndUpdate(req.body.productId,product,
{new:true});

if(!updatedProduct){
res.status(500).json({success:false,message: "cannot update the data"});
}

res.status(200).json({message:"Product has been updated"});
}

//delete product

const deleteProduct = async(req,res)=>{
  const product = await Product.findByIdAndDelete(req.body.productId);
  if(!product){
    res.status(404).json({success:false,message:"can't delete the product"});
  }
    res.status(200).json({message:"Item has been deleted"});
  
}

//aggregation

const getProductsSortedByPrice = async(req,res)=>{

  try{
    
    const sortedProducts = await Product.aggregate([
      
      {
        $sort:{price:1}
      },
      {
        $lookup:{
          from:'categories',
          localField:'category',
          foreignField:'_id',
          as:'categoryInfo',
        }
      },
      {
        $unwind:'$categoryInfo'
      },
      {
        $project:{
          _id:1,
          name:1,
          price:1,
          image:1,
          category:'$categoryInfo.name',
        }
      }
    ]);
    console.log(sortedProducts);
    res.json(sortedProducts);
   
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
}



 export{getUserProducts,updateProductView,getProducts,addProduct,updateProduct,addProductView,deleteProduct,getProductsSortedByPrice}
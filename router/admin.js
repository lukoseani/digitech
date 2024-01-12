import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import {Product} from '../models/product.js';
import {User} from '../models/users.js';
import {Category} from '../models/category.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import {updateProductView,getProducts,addProduct,updateProduct,addProductView,deleteProduct} from '../controllers/productController.js';
import {adminLoginView,adminLogin,adminHomeView} from '../controllers/loginController.js';

const router = express.Router();

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

const uploadOptions = multer({ storage: storage });
const uploadOptionsArray = multer({ storage: storage }).array('images',6);






router.use(uploadOptions.any());
// router.use(express.json());


router.get('/login',adminLoginView)

//admin login
router.post('/login',adminLogin);


// get home

router.get('/admin-home', adminHomeView);

//get products on admin panel

router.get('/products',getProducts);

//delete product from admin panel
router.post('/delete',deleteProduct);


// get add-product form
router.get('/add-product',addProductView)

// add new product to db through admin panel

router.post('/add-product',addProduct,uploadOptions.single('image'));

router.get('/update-product',updateProductView);


//update product

router.post('/update-product',updateProduct,uploadOptionsArray);



export default router;
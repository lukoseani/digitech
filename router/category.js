import express from 'express';
import multer from 'multer';
import path from 'path';
import {categoryView,addCategoryView,addCategory,updateCategoryView,updateCategory,deleteCategory,getCategory} from '../controllers/categoryController.js'


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






router.use(uploadOptions.any());


router.get('/',categoryView);

router.get('/add-category',addCategoryView)

// Add new category:

router.post('/add-category',addCategory,uploadOptions.single('image')
);

//update category

router.get('/update-category',updateCategoryView)


//update category

router.post('/update-category',updateCategory);



//delete category from admin panel
router.post('/delete',deleteCategory);

//get category by id

router.get('/:id',getCategory);

export default router;


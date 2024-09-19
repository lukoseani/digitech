import {Category} from '../models/category.js'

const categoryView = async(req,res)=>{
  const category = await Category.find();
  if(!category){
    res.status(500).json({success:false});
  }

  console.log(category);
  res.render("categories.ejs",{data:category});

}

//add category

const addCategoryView = async(req,res)=>{

  res.render("add-category.ejs");
}

const addCategory = async(req,res)=>{
    


  const file = req.files[0];
  

  if(!file){
    return res.status(500).send('file doesnt exist');
  }
  
  const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const fileName = file.filename ? file.filename : null;
  
  const existingCategory = await Category.findOne({name:req.body.name});
  if(existingCategory){
    return res.status(500).json({success:false,message: "Category already exists"});
  }
 

 let category = new Category({
    
    name: req.body.name,
    image: `${basepath}${fileName}`,
   

})

category = await category.save();
if(!category){
res.status(500).json({success:false,message: "cannot add the data"});
}
res.status(200).json({message:"category has been added"});
}


//update category view

const updateCategoryView = async(req,res)=>{
  const categoryId = req.query.categoryId;
  const category = await Category.findById(categoryId);
  console.log(category);
  const categoryName = category.name;
  res.render("update-category.ejs",{item:category});
  }

  //update category 

  const updateCategory = async(req,res)=>{
    
    
    
    const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let fileName
    if (req.files && req.files[0]) {
      const file = req.files[0];
      fileName = file.filename;
  }

    const currentCategory = await Category.findById(req.body.categoryId);
    if(req.body.name !== currentCategory.name){
    const existingCategory = await Category.findOne({name:req.body.name});
    if(existingCategory){
      return res.status(500).json({success:false,message: "Category already exists"});
    }
  }
    
    
    let category = {};
    if(req.body.name !== category.name){
    category.name = req.body.name;
    }
    if(fileName){
    category.image = `${basepath}${fileName}`;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(req.body.categoryId,category,
    {new:true});
    console.log(`updated category is ${updatedCategory}`);
    
    if(!updatedCategory){
    return res.status(500).json({success:false,message: "cannot update the category"});
    }
    res.status(200).json({message:"category updated"});
    }

    const deleteCategory = async(req,res)=>{
      console.log("hello");
      const category = await Category.findByIdAndDelete(req.body.categoryId);
      if(!category){
        res.status(404).json({success:false,message:"can't delete the category"});
      }
      res.status(200).json({message:"deleted product"});
    
      
    }

    //get category

    const getCategory = async(req,res)=>{

      const category = await Category.findById(req.params.id);
      if(!category){
        res.status(500).json({success:false});
      }
      res.json(category);
    
    }

export {categoryView,addCategoryView,addCategory,updateCategoryView,updateCategory,deleteCategory,getCategory}
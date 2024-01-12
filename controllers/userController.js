import {User} from '../models/users.js'

const userView = async(req,res)=>{
  const users = await User.find();
  if(!users){
    res.status(500).json({success:false});
  }
  res.render("users.ejs",{customers:users});
}

const blockUser = async(req,res)=>{

  const user = await User.findById(req.body.userId);
  if(!user.isBlocked){
  user.isBlocked = true;
  }
  else{
    user.isBlocked = false;
  }
  
  
  
  if(!user){
  res.status(500).json({success:false,message: "cannot update the user"});
  }
  await user.save();
  res.status(200).json({message:"user status has been updated"});
  }

  const getUser = async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHashed');
    if(!user){
      res.status(404).json({message:'user not found'});
    }
   
    res.json(user);
    
  
  }

 

export {userView,blockUser,getUser};
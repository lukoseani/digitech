import {User} from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import session from 'express-session';
import {OTP} from '../models/otpModel.js';
import {Address} from '../models/address.js';
import {Cart} from '../models/cart.js';
import {Product} from '../models/product.js';

const adminLogin = async(req,res)=>{
  const secret = process.env.secret;
  const user = await User.findOne({email:req.body.email});
  
  if(!user){
    res.status(404).json({success:false, message:'user not found'});
  }
  
  if(user && bcrypt.compareSync(req.body.password,user.passwordHashed)){
    const token = jwt.sign({
      userId:user.id,
      isAdmin:user.isAdmin,
    },
    secret,
    {
      expiresIn:'1w',
    }
    )
    const data = {
      token:token
    }
    res.cookie("jwt",token,{
      httpOnly:false,
    })
    
    
    res.render("admin-home.ejs");
    
    
  }
  else{
  res.status(400).json({message:'password is wrong'});
  }
}

const adminLoginView = async(req,res)=>{

  res.render("login.ejs");
}


const adminHomeView = async(req, res) => {
  const totalSales = await Cart.aggregate([
    {$group:{_id:null,totalsales:{$sum:'$totalPrice'}}}
  ])
  const total = totalSales.pop().totalsales;
  
  const dailySale = await Cart.aggregate([
    {
    $group:{
      _id:{$dateToString:{format:'%Y-%m-%d',date:'$dateOrdered'}},
      totalSales:{$sum:'$totalPrice'}
    }
  }
  ])
  const dailySales = dailySale.pop().totalSales;
  console.log(`dailySales is ${dailySales}`);

  const weeklySale = await Cart.aggregate([
    {
    $group:{
      _id:{$dateToString:{format: '%Y-%U',date:'$createdAt'}},
      totalSales:{$sum:'$totalPrice'}
    }
  }
  ])
  const weeklySales = weeklySale.pop().totalSales;
  

  const yearlySale = await Cart.aggregate([
    {
    $group:{
      _id:{$dateToString:{format: '%Y',date:'$dateOrdered'}},
      totalSales:{$sum:'$totalPrice'}
    }
  }
  ])
  const yearlySales = yearlySale.pop().totalSales;
  console.log(`yearlySales is ${yearlySales}`);


  res.render('admin-home.ejs',{totalsales:total,dailySales:dailySales,weeklySales:weeklySales,yearlySales:yearlySales});
}

//user login view

const userLoginView = async(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/products');
  }
  else{
  const users = await User.find();
  if(!users){
    res.status(500).json({success:false});
  }
  res.render("user-login.ejs",{customers:users,title:"User Login"});
  }
}






const registerView = async(req,res)=>{
  res.render("register.ejs");
}

//user login

const userLogin = async(req,res)=>{
  const email = req.body.email.trim();
  if(email == ""){
    return res.status(404).json({success:false, message:'Email can not be blank'});
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return res.status(403).json({message:'Email is not valid'});
}

  const user = await User.findOne({email:email});
  if(!user){
    res.status(404).json({success:false, message:'user not found'});
  }
  if(user.isBlocked){
    return res.status(404).json({ message:'Your account has been blocked!!'});
  }
  
  if(user && bcrypt.compareSync(req.body.password,user.passwordHashed)){
    
    
    req.session.user = user;
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      message: 'OTP sent successfully',
      email:email,
      otp:otp,
    });
 

  }
  else{
  res.status(400).json({message:'password is wrong'});
  }
  
  
}


//const register user

const registerUser = async(req,res)=>{
  try{
    const {name,email,password,confirmPassword,phone} = req.body;
    

    // All fields validation
  if(!name || !email || !password || !confirmPassword || !phone){
    
    return res.status(403).json({message:'All fields are required'});
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return res.status(403).json({message:'Email is not valid'});
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if(password.length < 8 || !passwordRegex.test(password)){
  return res.status(403).json({message:'Please use strong password'});
}

if(password !== confirmPassword){
  return res.status(403).json({message:'Your confirmed password is not matching'});
}

  // check if the user has already been registered
  const existingUser = await User.findOne({email});
  if(existingUser){
    return res.status(400).json({message:'Email already registered'})
  }
 

  //generating otp

  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  let result = await OTP.findOne({ otp: otp });
  while (result) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
    });
    result = await OTP.findOne({ otp: otp });
  }
  const otpPayload = { email, otp };
  const otpBody = await OTP.create(otpPayload);
  
  //pendingUser.set(otp,{name,email,password,phone});

  req.session.user = {
    name:name,
    email:email,
    password:password,
    phone:phone,
    email:email,
    otp:otp,
    loggedIn:false,
    isBlocked:false,
  };

  return res.status(200).json({message:"successfully send otp"});

  }
  catch(error){
    console.log(error.message);
    return res.status(500).json({message:error.message});
  }
}

//logout user
const logout = (req,res)=>{
  req.session.destroy();
  res.redirect('/products');
}

//get user profile

const getProfile = async(req,res)=>{
  try{
  const user = await User.findById(req.session.user._id).populate('address');
  const order = await Cart.find({ user: req.session.user._id }).populate({
    path: 'cartItems',
    populate:{
      path:'product',
    }
  }).populate('user');
  res.render("profile.ejs",{user:user,items:order});
}
catch(error){
  console.log(`error: ${error}`);
  res.status(500).json({message:"internal server error"});
}
}

//get address form

const getAddress = async(req,res)=>{
  res.render("address.ejs");

}

//add address

const addAddress = async(req,res)=>{

  const {addressLine1,city,province,postalcode,country} = req.body;

  if(!addressLine1 || !city || !province || !postalcode || !country){
    
    return res.render('address.ejs',{message:'All fields are required'});
  }

  let address = new Address({
    addressLine1:req.body.addressLine1,
    addressLine2:req.body.addressLine2,
    city:req.body.city,
    province:req.body.province,
    postalcode:req.body.postalcode,
  })
  address = await address.save();
  const user = await User.findByIdAndUpdate(req.session.user._id,{address:address});
  res.redirect('/users/profile');

}

const getNameEditForm = async(req,res)=>{
  const user = await User.findById(req.session.user._id);
  res.render("name-edit.ejs",{user:user});
}

//edit user name

const editName = async(req,res)=>{
  const name = req.body.name;
  console.log("name "+name);

  if(name == ""){
    return res.status(400).json({message:"name cannot be blank"});
  }

  if(!req.session.user){
    console.log("session expired");
    return res.status(400).json({message:"Cannot update the phone number"})
  } 

  const user = await User.findByIdAndUpdate(req.session.user._id,{name:name});
  res.status(200).json({message:"success"});
}

//get user edit form

const getEditForm = async(req,res)=>{
  const user = await User.findById(req.session.user._id);
  res.render("user-edit.ejs",{user:user});
}

//edit user phone number
const editUser = async(req,res)=>{
  
  
  let phone = req.body.phone;

  phone = Number(phone);
  

  if(String(phone).length !== 10 || phone === "" || isNaN(phone) || typeof phone !== 'number' || phone == null){

    return res.status(400).json({message:"Please enter valid phone number"})
  }
  if(!req.session.user){
    console.log("session expired");
    return res.status(400).json({message:"Cannot update the phone number"})
  }

  const user = await User.findByIdAndUpdate(req.session.user._id,{phone:phone});
  
  res.status(200).json({message:"success"});
}

//get password edit form

const getPasswordForm = (req,res)=>{
  
  res.render("passwordForm.ejs");

}

//update password

const updatePassword = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const password = req.body.newPassword;

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.render('passwordForm.ejs',{ message: "Check new password and confirm password" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (password.length < 8 || !passwordRegex.test(password)) {
      return res.render('passwordForm.ejs',{ message: "Please use a strong password" });
    }

    let user = await User.findById(userId);

    if (!user) {
       return res.render('passwordForm.ejs',{ message: "User not found" });
    }

    if (bcrypt.compareSync(req.body.currentPassword,user.passwordHashed)) {
  
      const newPasswordHashed = bcrypt.hashSync(password, 12);
      user = await User.findByIdAndUpdate(userId, { passwordHashed: newPasswordHashed }, { new: true });

      // Redirect after success
      res.redirect("/users/profile");
    } else {
      return res.render('passwordForm.ejs',{ message: "Current password is incorrect" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};









export {adminLogin,adminLoginView,adminHomeView,userLoginView,registerView,userLogin,registerUser,logout,getProfile,addAddress,getAddress,getEditForm,editUser,getNameEditForm,editName,getPasswordForm,updatePassword};
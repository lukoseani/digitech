import otpGenerator from 'otp-generator';
import {OTP} from '../models/otpModel.js';
import {User} from '../models/users.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';



//login otp view

const loginOtpView = async(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/products');
  }
  else{
 
  res.render("send-otp.ejs");
  }
}

//register otp view

const registerOtpView = async(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/products');
  }
  else{
  
  res.render("register-send-otp.ejs");
  }
}


//verify OTP

const verifyOtp = async(req,res)=>{
  const userEnteredOTP = req.body.otp;
  const sessionUser = req.session.user;
  const email = sessionUser.email;

  let message = '';
  try {
    // Find the last generated OTP for the provided email
    const lastOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!lastOTP) {
      // No OTP found for the provided email
      return res.status(404).json({ message: 'OTP not found' });
    }
    if (userEnteredOTP === lastOTP.otp) {
      // OTPs match, perform your desired action (grant access)
      req.session.loggedIn = true;
      
      return res.status(200).json({ message: 'OTP verification successful'});
    } else {
      message = "Invalid OTP";
      return res.status(404).json({ message: 'Invalid OTP'});
    }
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}



//verify otp register

const registerVerifyOtp = async(req,res)=>{
  const userEnteredOTP = req.body.otp;
  const user = req.session.user;
  const email = user.email;

  let message = '';
  try {
    // Find the last generated OTP for the provided email
    const lastOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!lastOTP) {
      // No OTP found for the provided email
      return res.status(404).json({ message: 'OTP not found' });
    }
    if (userEnteredOTP === lastOTP.otp) {
     
      
      // OTPs match, perform your desired action (e.g., grant access)
      req.session.loggedIn = true;
      let newUser = new User({
        name: user.name,
        email: user.email,
        passwordHashed:bcrypt.hashSync(user.password, 12),
        phone:user.phone,
      });

      newUser = await newUser.save();
      
     
      if(!newUser){
      return res.status(404).json({message:"failed to create account"});
      }

      req.session.user = newUser;
      
      
      return res.status(200).json({ message: 'OTP verification successful and user account has been created' });
    } else {
      message = "Invalid OTP";
      return res.status(404).json({ message: 'Invalid OTP'});
    }
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}

const resendOtp = async(req,res)=>{
  try{

      const user = req.session.user;
      const email = user.email;
      
      

  //generate new otp

  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  //check if the generated alphabet already exists
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
catch(error){
  console.error(error);
  res.status(500).json({message:'failed to resend otp, error encountered'});
}

}
  

export  {registerVerifyOtp,resendOtp,registerOtpView,verifyOtp,loginOtpView};
import express from 'express';
import {userLoginView,registerView,userLogin,registerUser,logout,getProfile,addAddress,editAddress,deleteAddress,getEditAddress,getAddAddress,getEditForm,editUser,updatePassword,getPasswordForm,getNameEditForm,editName,getOrderDetails} from '../controllers/loginController.js';
import {registerVerifyOtp,resendOtp,registerOtpView,verifyOtp,loginOtpView} from '../controllers/otpController.js'
import {checkSession} from '../helpers/session-handler.js';
import {User} from '../models/users.js';


const router = express.Router();




router.get('/login',userLoginView);

//get otp page

 router.get('/send-otp',loginOtpView);

router.get('/register/send-otp',registerOtpView);

//get register page
router.get('/register',registerView);



//user login
router.post('/login',userLogin)

//send otp 

router.post('/send-otp',verifyOtp);



//resend-otp

router.post('/resend-otp',resendOtp)

//logout

router.get('/logout',logout)



//register-otp
router.post('/register/send-otp',registerVerifyOtp);


//register

router.post('/register',registerUser);

//get user profile

router.get('/profile',checkSession,getProfile);

//get address 

router.get('/address-edit',checkSession,getEditAddress);

//get add address
router.get('/address-add',checkSession,getAddAddress);

//add address

router.post('/add-address',checkSession,addAddress);

//edit address

router.post('/edit-address',checkSession,editAddress);

//delete adress
router.post('/delete-address',checkSession,deleteAddress);

//get edit form 

router.get('/edit-user',getEditForm);
router.get('/edit-name',checkSession,getNameEditForm);

//edit user info

router.post('/edit-user',editUser);
router.post('/edit-name',editName);

//update password
router.get('/get-password-form',checkSession,getPasswordForm);

router.post('/update-password',updatePassword);

//get order-details screen
router.get('/order-details',checkSession, getOrderDetails);



export default router;
import {expressjwt} from "express-jwt";

const API_URL = process.env.API_URL;

function authJwt(){
 
  const secret = process.env.secret;
  return expressjwt({
    secret,
    algorithms:['HS256'],
    isRevoked:isRevoked,
  }).unless({
    path:[
      {url:/\/products(.*)/, methods:['GET','OPTIONS']},
      {url:/\/admin(.*)/, methods:['GET','OPTIONS']},
      {url:/\/categories(.*)/, methods:['GET','OPTIONS']},
      {url:/\/public\/uploads(.*)/, methods:['GET','OPTIONS']},
      { url: /\/cart\/increment\/(.*)/, methods: ['POST', 'OPTIONS'] },
      { url: /\/cart\/decrement\/(.*)/, methods: ['POST', 'OPTIONS'] },
      { url: /\/cart\/paypalsuccess\/(.*)/, methods: ['POST','GET', 'OPTIONS'] },
      `/users/login`,
      `/admin/login`,
      `/users/register`,
      `/users/register/send-otp`,
      '/users/send-otp',
      '/users/resend-otp',
      `/users/logout`,
      `/users/profile`,
      `/cart`,
      `/cart/empty-cart`,
      `/cart/delete`,
      `/cart/add-address`,
      `/cart/checkout`,
      `/cart/confirm-order`,
      '/users/edit-user',
      `/users/address`,
      `/users/get-password-form`,
      `/users/update-password`,
      `/users/add-address`,
      `/cart/cancel-order`,
      `/cart/create-paypal-order`,
      `/cart/paypalsuccess`
      
      
    ]
  })
  
}

async function isRevoked(req, token) {

  if (!token.payload.isAdmin) {
    console.log('Revoking token for non-admin user');
    return true;
  } 
}

export default authJwt;
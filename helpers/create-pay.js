import paypal from '@paypal/checkout-server-sdk';

const createPay = (payment) =>{

  return new Promise((resolve,reject)=>{
    paypal.payment.create(payment,function(err,payment){
      if(err){
        reject(err);
      }
      else{
        resolve(payment);
      }
    })
  })
}

export default createPay;
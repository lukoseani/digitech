import mongoose from 'mongoose';
import mailSender from '../utils/mailsender.js';

const otpSchema = new mongoose.Schema({
  email:{
    type:String,
    required: true,
  },
  otp:{
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
    expires : 60 * 5,
  },
});

async function sendVerificationEmail(email,otp){
  try{
    const mailResponse = await mailSender(
      email,
      "verification Email",
      `<h1>Please confirm your OTP </h1>
      <p>Here is your OTP code: ${otp} </p>`
      
    );
    console.log("Email sent successfully: ",mailResponse);

  }
  catch(error){
    console.log(`Error occured while sending email ${error}`);
    throw error;
  }
}

otpSchema.pre("save",async function(next){
  console.log("new document saved to the database");
  if(this.isNew){
    await sendVerificationEmail(this.email,this.otp);
  }
  next();
});

const OTP = mongoose.model('OTP',otpSchema);
export {OTP};


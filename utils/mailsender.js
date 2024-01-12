import nodemailer from 'nodemailer';

const mailSender = async(email,title,body)=>{
  try{
    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
      }
      });

      let info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject:title,
        html:body,
      });

      console.log("Email info: ",info);
      return info;
  }
  catch(error){
    console.log(error.message);
  }
}

export default mailSender;
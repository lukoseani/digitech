import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import authJwt from './helpers/jwt.js'
import errorHandler from './helpers/error-handler.js';
import path from 'path';
import {fileURLToPath} from 'url';
import session from 'express-session';
import flash from 'express-flash';
import helmet from 'helmet'








//Routers path
import productsRouter from './router/product.js';
import categoriesRouter from './router/category.js'
import usersRouter from './router/user.js';
import adminRouter from './router/admin.js';
import loginRegisterRouter from './router/user-register-login.js';
import cartRouter from './router/cart.js'
import ordersRouter from './router/order.js';


const app = express();
const port = 4000;
const api = process.env.API_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(cors());
app.options('*', cors())



  mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>{
      console.log("Connected to DB");
    })
      .catch((err)=>{
        console.error(err);
      });


     
      

      

      
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));
app.use('/public/uploads',express.static(__dirname+'/public/uploads'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(authJwt());
app.use(errorHandler);
app.use(session({secret:"mysecret",cookie:{maxAge:12 * 60 * 60 * 10000}}));

app.use(flash());




app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net","https://www.paypal.com"],
    },
  },
  
}));






//Routers
app.use(`/products`,productsRouter);
app.use(`/admin/categories`,categoriesRouter);
app.use(`/admin/users`,usersRouter);
app.use(`/admin/orders`,ordersRouter);
app.use(`/users`,loginRegisterRouter);
app.use(`/admin`,adminRouter);
app.use('/cart',cartRouter);




app.listen(port,()=>{
  
  console.log(`App is running at port ${port}`);
})
export default app;
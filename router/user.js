import express from 'express';
const router = express.Router();
import {userView,blockUser,getUser} from '../controllers/userController.js';



router.get('/',userView)




// block user info

router.post('/blockUser',blockUser);


// get a single user
router.get('/:id',getUser);




export default router;
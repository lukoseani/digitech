import express from 'express';
import {getOrderList,changeOrderStatus,cancelOrder} from '../controllers/ordersController.js';

const router = express.Router();

router.get('/',getOrderList);

//change order status
router.post('/changeStatus',changeOrderStatus);

//cancel order
router.post('/cancelOrder',cancelOrder);



export default router;
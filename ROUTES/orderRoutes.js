import express from "express";
import authMiddleware from '../MIDDLEWARE/Auth_Token.js'

import {getOrders,createOrder ,getUserOrders,updateOrder,deleteorder}  from '../CONTROLLER/orderController.js'
const route2=express.Router();
//if admin need to view all orders


route2.get('/getallorders',authMiddleware,getOrders);

route2.post('/order', authMiddleware ,createOrder);

route2.get('/getAllOrdersofUser',authMiddleware,getUserOrders);

route2.put('/order/:id', authMiddleware,updateOrder )

route2.delete('/order/:id',authMiddleware,deleteorder)

export default route2;
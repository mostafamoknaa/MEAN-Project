import express from "express";
import authMiddleware from '../MIDDLEWARE/Auth_Token.js'

import {getOrders,createOrder ,getUserOrders }  from '../CONTROLLER/orderController.js'
const route2=express.Router();

route2.get('/order',getOrders);

route2.post('/order', authMiddleware ,createOrder);

route2.get('/getAllOrdersofUser',authMiddleware,getUserOrders);

export default route2;
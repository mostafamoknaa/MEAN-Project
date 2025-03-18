import express from 'express';
import { makeorder, getallorders, getuserorder, cancleorder, deliverorder } from '../Controller/order_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js'

export const orderRoutes = express.Router()


orderRoutes.post('/makeorder',authMiddleware, makeorder);
orderRoutes.get('/getorders', authMiddleware,getallorders);
orderRoutes.get('/getuserorder',authMiddleware,getuserorder);
orderRoutes.put('/cancleorder/:orderId',authMiddleware, cancleorder);
orderRoutes.put('/deliverorder/:id', authMiddleware,deliverorder);
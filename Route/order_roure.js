import express from 'express';
import { makeorder, getallorders, getuserorder, cancleorder, deliverorder, getoderbyid, getuserorders } from '../Controller/order_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js'

export const orderRoutes = express.Router()

orderRoutes.post('/makeorder', authMiddleware,makeorder);
orderRoutes.get('/getorders', getallorders);
orderRoutes.get('/getuserorder', getuserorder);
orderRoutes.get('/getuserorder/:id', getuserorders)
orderRoutes.put('/cancleorder/:orderId', cancleorder);
orderRoutes.put('/deliverorder/:id', deliverorder);
orderRoutes.get('/getoderbyid/:id', getoderbyid); //get order

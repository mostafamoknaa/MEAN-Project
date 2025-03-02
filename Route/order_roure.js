import express from 'express';
import { makeorder, getallorders, getuserorder } from '../Controller/order_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js'

export const orderRoutes = express.Router()
orderRoutes.use(authMiddleware);

orderRoutes.post('/makeorder', makeorder);
orderRoutes.get('/getorders', getallorders);
orderRoutes.get('/getuserorder', getuserorder);
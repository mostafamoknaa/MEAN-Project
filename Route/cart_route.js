import express from 'express';
import { getusercart, addtousercart, updatecartquantity, deletefromcart, processPayment, gustuser, applypromocode } from '../Controller/cart_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js';

export const cartRoutes = express.Router()

cartRoutes.use(authMiddleware);

cartRoutes.get('/getusercart', getusercart);
cartRoutes.post('/addtocart', addtousercart);
cartRoutes.put('/updatecartquantity', updatecartquantity);
cartRoutes.delete('/deletefromcart', deletefromcart);
cartRoutes.post('/gustuser', gustuser);
cartRoutes.post('/processpayment', processPayment);
cartRoutes.post('/applypromocode', applypromocode);
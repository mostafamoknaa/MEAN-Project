import express from 'express';
import { getusercart, addtousercart, updatecartquantity, deletefromcart, processPayment, gustuser, applypromocode } from '../Controller/cart_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js';

export const cartRoutes = express.Router()

//cartRoutes.use(authMiddleware);

cartRoutes.get('/getusercart', authMiddleware, getusercart);
cartRoutes.post('/addtocart', addtousercart);
cartRoutes.put('/updatecartquantity', authMiddleware, updatecartquantity);
cartRoutes.delete('/deletefromcart/:userid', authMiddleware, deletefromcart);
cartRoutes.post('/gustuser', gustuser);
cartRoutes.post('/processpayment/:userid', processPayment);
cartRoutes.post('/applypromocode/:userid', applypromocode);
import express from 'express';
import { getusercart, addToUserCart, updatecartquantity, deletefromcart, processPayment, gustuser, applypromocode } from '../Controller/cart_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js';

export const cartRoutes = express.Router()

// cartRoutes.use(authMiddleware);

cartRoutes.get('/getusercart',authMiddleware, getusercart);
cartRoutes.post('/addtocart',authMiddleware, addToUserCart);
cartRoutes.put('/updatecartquantity', updatecartquantity);
cartRoutes.delete('/deletefromcart/:userid', deletefromcart);
cartRoutes.post('/gustuser', gustuser);
cartRoutes.post('/processpayment/:userid', processPayment);
cartRoutes.post('/applypromocode/:userid', applypromocode);
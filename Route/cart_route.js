import express from 'express';
import { getusercart, addToUserCart, updatecartquantity, deleteFromCart, processPayment, gustuser, applypromocode } from '../Controller/cart_controller.js';
import { authMiddleware } from '../Middleware/auth_token.js';

export const cartRoutes = express.Router()

// cartRoutes.use(authMiddleware);

cartRoutes.get('/getusercart',authMiddleware, getusercart);
cartRoutes.post('/addtocart',authMiddleware, addToUserCart);
cartRoutes.put('/updatecartquantity', updatecartquantity);
cartRoutes.delete('/deletefromcart/:id',authMiddleware, deleteFromCart);
cartRoutes.post('/gustuser', gustuser);
cartRoutes.post('/processpayment/:userid', processPayment);
cartRoutes.post('/applypromocode/:userid', applypromocode);
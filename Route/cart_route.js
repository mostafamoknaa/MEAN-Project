import express from 'express';
import { getusercart, addtousercart, updatecartquantity, deletefromcart, processPayment, gustuser, applypromocode } from '../Controller/cart_controller.js';

export const cartRoutes = express.Router()

cartRoutes.get('/getusercart/:userid', getusercart);
cartRoutes.post('/addtocart/:userid', addtousercart);
cartRoutes.put('/updatecartquantity/:userid', updatecartquantity);
cartRoutes.delete('/deletefromcart/:userid', deletefromcart);
cartRoutes.post('/gustuser', gustuser);
cartRoutes.post('/processpayment/:userid', processPayment);
cartRoutes.post('/applypromocode/:userid', applypromocode);
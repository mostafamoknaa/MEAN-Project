import express from 'express';
import { getusercart, addtousercart, updatecartquantity, deletefromcart } from '../Controller/cart_controller.js';

export const cartRoutes = express.Router()

cartRoutes.get('/getusercart/:userid', getusercart);
cartRoutes.post('/addtocart/:userid', addtousercart);
cartRoutes.put('/updatecartquantity/:userid', updatecartquantity);
cartRoutes.delete('/deletefromcart/:userid', deletefromcart);
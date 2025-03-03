import express from "express";
import  { createProduct,getSellerProducts,updateProductBySeller,deleteProductBySeller,getAllProducts } from  '../CONTROLLER/productcontroller.js';

import authMiddleware from '../MIDDLEWARE/Auth_Token.js'


         

const route5=express.Router();

// seller CRUD FOR PRODUCT  
route5.post('/product',authMiddleware,createProduct);


route5.get('/product',authMiddleware, getSellerProducts);

route5.get('/allproduct', getAllProducts);

route5.put('/product/:id',authMiddleware,updateProductBySeller);
route5.delete('/product/:id',authMiddleware,deleteProductBySeller);


export default route5;
      




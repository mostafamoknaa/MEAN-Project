import express from "express";


const route=express.Router();

// ADMIN CRUD FOR PRODUCT  WITHOUT CREATE PRODUCT
route.get('/product',getAllProduct);


route.put('/product/:id', updateProduct);

route.delete('/product/:id', deleteProduct);

      
//SELLER ALL CRUD OPERATIONS



import express from "express";
import { authMiddleware } from "../Middleware/auth_token.js"

import { signup, signin, verifyEmail, updateUser, deleteUser, createUser, getUserById, getAllUsers, addToWishlist, deleteProductFromWishlist, getUserinfo, updateUserinfo, deleteUserinfo, acceptOrRejectUser, showProductInWishlist } from "../Controller/user_controller.js"




export const route = express.Router();

route.post('/signup', signup);
route.post('/login', signin);
route.get("/verify/:email", verifyEmail)

//Admin

route.get('/getuserinfo', authMiddleware, getUserinfo);
route.put('/updateuserinfo', authMiddleware, updateUserinfo);
route.delete('/deleteuserinfo', authMiddleware, deleteUserinfo);

route.get('/users', authMiddleware, getAllUsers);
route.get('/users/:id', getUserById);
route.post('/users', authMiddleware, createUser);
route.put('/users/:id', authMiddleware, updateUser);
route.delete('/users/:id', authMiddleware, deleteUser);
route.put('/users/:id', authMiddleware, acceptOrRejectUser);

//whishlist

route.post('/addtowishlist', authMiddleware, addToWishlist);
route.delete('/deletefromwishlist/:id', authMiddleware, deleteProductFromWishlist);
route.get('/allwishlist', authMiddleware, showProductInWishlist);
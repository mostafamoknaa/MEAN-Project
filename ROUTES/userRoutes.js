import express from "express";
import authMiddleware from '../MIDDLEWARE/Auth_Token.js'
import  { signup, login, verfiyemail , updateUser, deleteUser , createUser , getUserById, getAllUsers,addToWishlist,deleteProductFromWishlist,getUserinfo,updateUserinfo,deleteUserinfo} from "../CONTROLLER/userController.js"


// NORMAL CUSTOMER OR SELLER

const route=express.Router();

route.post('/signup', signup);

route.post('/login', login);

route.get("/verfiy/:email",verfiyemail);

//ADMIN PROFILE GET AND UPDATE  AND  DELETE TODO

route.get('/getuserinfo',authMiddleware, getUserinfo);
route.put('/updateuserinfo',authMiddleware, updateUserinfo);
route.delete('/deleteuserinfo',authMiddleware, deleteUserinfo);



/**TODO */


//ADMIN CRUD


route.get('/users',authMiddleware,getAllUsers);

route.get('/users/:id',getUserById);

route.post( '/users',authMiddleware,createUser);

route.put( '/users/:id',authMiddleware,updateUser);

route.delete( '/users/:id',authMiddleware,deleteUser);


//WISHLIST ROUTES

route.post('/addtowishlist',authMiddleware,addToWishlist);
route.delete('/deletefromwishlist/:id',authMiddleware,deleteProductFromWishlist);

export default route; 
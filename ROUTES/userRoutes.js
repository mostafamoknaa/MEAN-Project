import express from "express";

import  { signup, login, verfiyemail , updateUser, deleteUser , createUser , getUserById, getAllUsers} from "../CONTROLLER/userController.js"


// NORMAL CUSTOMER OR SELLER

const route=express.Router();

route.post('/signup', signup);

route.post('/login', login);

route.get("/verfiy/:email",verfiyemail);


//ADMIN CRUD


route.get('/users',getAllUsers);

route.get('/users/:id',getUserById);

route.post( '/users',createUser);

route.put( '/users/:id',updateUser);

route.delete( '/users/:id',deleteUser);

export default route; 
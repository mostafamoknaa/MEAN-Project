import express from "express";

import  { signup, login ,verfiyemail} from "../CONTROLLER/userController.js"




const route=express.Router();

route.post('/signup', signup);

route.post('/login', login);

route.get("/verfiy/:email",verfiyemail);


// route.get('/users',getAllUsers);


// route.post( '/users',createUser);

// route.put( '/users/:id',updateUser);

// route.delete( '/users/:id',deleteUser);

export default route; 
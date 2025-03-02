import express from "express";

import { signup, login, verfiyemail } from "../Controller/user_controller.js"




export const route = express.Router();

route.post('/signup', signup);

route.post('/login', login);

route.get("/verfiy/:email", verfiyemail);
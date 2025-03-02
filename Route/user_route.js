import express from "express";

import { signup, signin, verifyEmail } from "../Controller/user_controller.js"




export const route = express.Router();

route.post('/signup', signup);

route.post('/login', signin);

route.get("/verify/:email", verifyEmail)
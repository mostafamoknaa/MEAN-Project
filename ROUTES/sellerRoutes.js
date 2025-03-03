import express from "express";
import authMiddleware from '../MIDDLEWARE/Auth_Token.js'
import {createseller} from '../CONTROLLER/sellercontroller.js'
const route6=express.Router();


route6.post('/createseller', authMiddleware, createseller);

export default route6;
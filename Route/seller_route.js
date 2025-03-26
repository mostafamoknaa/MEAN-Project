import express from "express";
import {authMiddleware} from '../Middleware/auth_token.js'
import {createseller} from '../Controller/seller_controller.js'
export const route6=express.Router();


route6.post('/createseller', authMiddleware, createseller);


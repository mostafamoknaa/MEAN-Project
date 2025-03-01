import express from 'express';
import { makeorder, getallorders, getuserorder } from '../Controller/order_controller.js';

export const orderRoutes = express.Router()

orderRoutes.post('/makeorder/:userid', makeorder);
orderRoutes.get('/getorders', getallorders);
orderRoutes.get('/getuserorder/:userid', getuserorder);
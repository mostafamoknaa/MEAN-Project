import express from 'express';
import { createpromocode, deletepromocode } from '../Controller/promocode_controller.js';
export const prompRoute = express.Router()


prompRoute.post('/createpromocode', createpromocode);
prompRoute.delete('/deletepromocode/:id', deletepromocode);
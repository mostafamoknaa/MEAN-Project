import express from 'express';

import {gemnifuction} from '../Controller/gemni_controller.js'
export const   gemni = express.Router();

gemni.post(  '/chat' ,gemnifuction);


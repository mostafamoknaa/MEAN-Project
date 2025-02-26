import express from 'express';
import { connectDB } from "./Model/connect.js"
import { cart } from './Model/cart_model.js';



const app = express()
app.use(express.json())

const port = 3000

connectDB;
cart;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
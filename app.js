import express from 'express';
import { connectDB } from "./Model/connect.js"
import { cartRoutes } from "./Route/cart_route.js"
const app = express()
app.use(express.json())
app.use(cartRoutes);

const port = 3000

connectDB;


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
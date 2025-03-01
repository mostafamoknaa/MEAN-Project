import express from 'express';
import { connectDB } from "./Model/connect.js"
import { cartRoutes } from "./Route/cart_route.js"
import { prompRoute } from './Route/promocode_route.js';


const app = express()
app.use(express.json())
app.use(cartRoutes);
app.use(prompRoute);

const port = 3000

connectDB;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
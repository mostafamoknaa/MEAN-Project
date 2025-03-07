import express from 'express';
import { connectDB } from "./Model/connect.js"
import { cartRoutes } from "./Route/cart_route.js"
import { orderRoutes } from "./Route/order_roure.js"
import { route } from "./Route/user_route.js"
import { prompRoute } from "./Route/promocode_route.js"
import { router3 } from './Route/auth_route.js';
import  {route6} from './Route/seller_route.js';

const app = express()
app.use(express.json())
app.use(route);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(prompRoute);
app.use(router3);
app.use(route6);


const port = 3000

connectDB;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
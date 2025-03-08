import express from 'express';
import { connectDB } from "./Model/connect.js"
import { cartRoutes } from "./Route/cart_route.js"
import { orderRoutes } from "./Route/order_roure.js"
import { route } from "./Route/user_route.js"
import { prompRoute } from "./Route/promocode_route.js"
import { router3 } from './Route/auth_route.js';
import { route6 } from './Route/seller_route.js';
import { route4 } from './Route/review_route.js';
import { productRoutes } from './Route/product_route.js';
import { catrouter } from './Route/category_route.js'
import cors from 'cors';


const app = express()
app.use(express.json())
app.use(cors())
app.use(route);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(prompRoute);
app.use(productRoutes);
app.use(router3);
app.use(route6);
app.use(route4);
app.use(catrouter);


const port = 3000

connectDB();
//myconnection;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
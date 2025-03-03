import express from 'express';
import connectDB from "./DATABASE/dbConnection.js"

import route from "./ROUTES/userRoutes.js"
import route2 from "./ROUTES/orderRoutes.js"
import router3  from "./ROUTES/authRoutes.js"
import route4 from './ROUTES/reviewRoutes.js'
import route5 from './ROUTES/productRoutes.js'
import route6 from './ROUTES/sellerRoutes.js'
const app=express();
app.use(express.json());
app.use(route);
app.use(route2);
app.use(router3);
app.use(route4);
app.use(route5);
app.use(route6);

app.use(express.static('public'));

app.listen(3000,()=>{

console.log("the server is running on port 3000");

});

connectDB();

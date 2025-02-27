import express from 'express';
import connectDB from "./DATABASE/dbConnection.js"

import route from "./ROUTES/userRoutes.js"
import route2 from "./ROUTES/orderRoutes.js"
import router3  from "./ROUTES/authRoutes.js"

const app=express();
app.use(express.json());
app.use(route);
app.use(route2);

app.use(express.static('public'));
app.use(router3);
app.listen(3000,()=>{

console.log("the server is running on port 3000");

});

connectDB();

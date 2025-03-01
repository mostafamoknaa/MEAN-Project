import express from "express";
import { myConnection } from "./DataBase/dbconnection.js";
import "./DataBase/Model/product.model.js"; 
import { productRoutes } from "./Modules/Routes/product.Route.js";

await myConnection

const app = express();
app.use(express.json());
app.use("/api", productRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
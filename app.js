import express from "express";
import { myConnection } from "./Model/connect.js";
import "./Model/product.model.js"; 
import { productRoutes } from "./Routes/product.Route.js";

await myConnection

const app = express();
app.use(express.json());
app.use("/api", productRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
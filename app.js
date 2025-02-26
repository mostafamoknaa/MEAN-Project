import express from 'express';
import { connectDB } from "./Model/connect.js"



const app = express()
app.use(express.json())

const port = 3000

connectDB;


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
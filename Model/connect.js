import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    const uri = process.env.MONGO_URI;
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("MongoDB connection error:", e);

    }
}

// import mongoose from 'mongoose';


// export const myconnection = mongoose.connect('mongodb://localhost:27017/Project')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB', err));
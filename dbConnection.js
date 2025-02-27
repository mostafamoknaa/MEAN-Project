import mongoose from "mongoose";


async function connectDB() {

    const uri = "mongodb+srv://mo017886:7Ydc6hB8olAhrrER@cluster0.c6bi8.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0";
    
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }catch(e){
        console.error("MongoDB connection error:", e);
    
    }
    
    
    
    }
    export default connectDB;
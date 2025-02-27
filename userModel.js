
import mongoose from "mongoose";



const userSchema = mongoose.Schema({

    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String},
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default :'customer' },
    emailVerified: { type: Boolean, default: false },
    address:
    {
        street: String,
        city: String,
        country: String
    },
    paymentMethods : String,
    
   


},{
    timestamps: true,
    versionKey: false
}
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
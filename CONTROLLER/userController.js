import userModel from '../MODELS/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sendEmail from '../email/email.js'

const signup = async (req, res) => {
    try {
        let foundedEmail = await userModel.findOne({ email: req.body.email });

        if (foundedEmail) {
            return res.status(400).send({ message: "Email already exists" });
        }

        req.body.password = await bcrypt.hash(req.body.password, 10);

        let user = new userModel(req.body);
        await user.save();
        sendEmail(req.body.email);
        res.status(201).send({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};



const login = async (req, res) => {

    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ message: "Invalid email or password" })
    }
    let isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) {
        return res.status(400).send({ message: "Invalid email or password" })
    }
    if (user.isconfermed != true) {

        return res.status(400).send({ message: "Email not confirmed" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'iti', function (err, token) {
        console.log(token);
    });

    res.status(200).send(token);

};



const verfiyemail = async (req, res) => {

    const token = await req.params.email;
    console.log(token);

    let emailVerfiy = jwt.verify(token, 'myemail');
    console.log(emailVerfiy);
    let user = await userModel.findOneAndUpdate({ email: emailVerfiy }, { isconfermed: true });
    res.send("EMAIL VERFIYED")

};


//ALL CRUD OPERATIONS OF ADMIN 



const getAllUsers = async (req, res) => {
    try {

        const userId = req.user.id;

        const userrole = await userModel.findById(userId);

        if (userrole.role !== "admin") {
            return res.status(403).json({ message: "You are not admin" });
        }
        else {

        const users = await userModel.find();
        res.json(users);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET USER BY ID and DELETE AND UPDATE  it suitable with get Profile management 
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 this user created by admin so it hasn't need to verfiy email , before use this api you should sure that the 
 user in system role as admin
 */

const createUser = async (req, res) => {

    try {

        const userId = req.user.id;

        const userrole = await userModel.findById(userId);

        if (userrole.role !== "admin") {
            return res.status(403).json({ message: "You are not admin" });
        }
        else {


            let foundedEmail = await userModel.findOne({ email: req.body.email });

            if (foundedEmail) {
                return res.status(400).send({ message: "Email already exists" });
            }

            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.isconfermed = true;
            let user = new userModel(req.body);

            await user.save();

            res.status(201).send({ message: "User registered successfully" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const updateUser = async (req, res) => {
    try {


        const userId = req.user.id;

        const userrole = await userModel.findById(userId);

        if (userrole.role !== "admin") {
            return res.status(403).json({ message: "You are not admin" });
        }
        else {
            const id = req.params.id;
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
            res.json(updatedUser);

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const deleteUser = async (req, res) => {
    try {

        const userId = req.user.id;

        const userrole = await userModel.findById(userId);

        if (userrole.role !== "admin") {
            return res.status(403).json({ message: "You are not admin" });
        }
        else {
            const id = req.params.id;
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await userModel.findByIdAndDelete(id);
            res.json({ message: "User deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



// WISHLIST API


const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { wishlist } = req.body;

        if (!wishlist || !Array.isArray(wishlist)) {
            return res.status(400).json({ message: "Invalid wishlist data" });
        }


        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: { $each: wishlist } } },
            { new: true }
        ).populate("wishlist");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Wishlist updated successfully",
            wishlist: updatedUser.wishlist
        });
    } catch (error) {
        console.error("Error updating wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteProductFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (!user.wishlist.includes(productId)) {
            return res.status(400).json({ message: "Product not found in wishlist" });
        }


        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();

        res.status(200).json({
            message: "Product removed from wishlist successfully",
            wishlist: user.wishlist
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// PROFILE INFORMATION ENDPOINTS


const getUserinfo = async (req, res) => {

    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User information retrieved successfully",
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




const updateUserinfo = async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();
        res.status(200).json({
            message: "User information updated successfully",
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteUserinfo = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {

            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",

            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

















export { signup, login, verfiyemail, updateUser, deleteUser, createUser, getUserById, getAllUsers, addToWishlist, deleteProductFromWishlist, getUserinfo, updateUserinfo, deleteUserinfo };
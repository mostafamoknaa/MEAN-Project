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
        const users = await userModel.find();
        res.json(users);
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
        let foundedEmail = await userModel.findOne({ email: req.body.email });

        if (foundedEmail) {
            return res.status(400).send({ message: "Email already exists" });
        }

        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.isconfermed = true;
        let user = new userModel(req.body);

        await user.save();

        res.status(201).send({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await userModel.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




export { signup, login, verfiyemail , updateUser, deleteUser , createUser , getUserById, getAllUsers};
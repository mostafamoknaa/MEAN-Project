import userModel from '../Model/user_model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sendEmail from '../Email/email.js'

const signup = async(req, res) => {
    try {

        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
            res.send("User already exists");
            return
        }
        req.body.password = await bcrypt.hashSync(req.body.password, 10);
        const users = await userModel.insertMany(req.body);
        sendEmail(req.body.email)
        res.send("User created successfully");

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const signin = async(req, res) => {
    try {


        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        if (user.isconfermed == false) {
            res.status(400).json({ message: "Please verify your email" });
            return
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'mostafa', { expiresIn: '1h' });

        res.json({ message: "User logged in successfully", token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const verifyEmail = (req, res) => {
    const token = req.params.email
    jwt.verify(token, "myemail", async(err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" })
        }
        const email = decoded;
        await userModel.findOneAndUpdate({ email: email }, { isconfermed: true })


        res.json({ message: "Email verified you can now login" })
    })

}






export { signup, signin, verifyEmail };
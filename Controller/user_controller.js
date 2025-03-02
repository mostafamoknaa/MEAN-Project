import userModel from '../Model/user_model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sendEmail from '../Email/email.js'

const signup = async(req, res) => {
    try {
        let foundedEmail = await userModel.findOne({ email: req.body.email });

        if (foundedEmail) {
            return res.status(400).send({ message: "Email already exists" });
        }

        req.body.password = await bcrypt.hashSync(req.body.password, 10);

        let user = new userModel(req.body);
        await user.save();
        sendEmail(req.body.email);
        res.status(201).send({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};



const login = async(req, res) => {

    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ message: "Invalid email" })
    }
    let isValidPassword = await bcrypt.compareSync(req.body.password, user.password)
    if (!isValidPassword) {
        return res.status(400).send({ message: "Invalid password" })
    }
    if (user.isconfermed != true) {

        return res.status(400).send({ message: "Email not confirmed" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'iti', function(err, token) {
        console.log(token);
    });

    res.status(200).send(token);

};



const verfiyemail = async(req, res) => {

    const token = await req.params.email;
    console.log(token);

    let emailVerfiy = jwt.verify(token, 'myemail');
    console.log(emailVerfiy);
    let user = await userModel.findOneAndUpdate({ email: emailVerfiy }, { isconfermed: true });
    res.send("EMAIL VERFIYED")

};







export { signup, login, verfiyemail };
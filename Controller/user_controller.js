import userModel from "../Model/user_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../Email/email.js";

const signup = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      res.send("User already exists");
      return;
    }
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
    const users = await userModel.insertMany(req.body);
    sendEmail(req.body.email);
    res.send("User created successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (user.isConfirmed == false) {
      res.status(400).json({ message: "Please verify your email" });
      return;
    }
    if (user && isMatch && user.isConfirmed == true) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        "mostafa",
        function (err, token) {
          console.log(token);
        }
      );

      res.json({ message: "User logged in successfully", token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyEmail = (req, res) => {
  const token = req.params.email;
  jwt.verify(token, "myemail", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const email = decoded;
    await userModel.findOneAndUpdate({ email: email }, { isConfirmed: true });

    res.json({ message: "Email verified you can now login" });
  });
};

export async function acceptOrRejectUser(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if (!status || !["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const user = await userModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User status updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export { signup, signin, verifyEmail };

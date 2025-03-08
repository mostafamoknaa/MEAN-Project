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
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, "mostafa");

    res.json({ message: "User logged in successfully", token });
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
    await userModel.findOneAndUpdate({ email: email }, { isconfermed: true });

    res.json({ message: "Email verified you can now login" });
  });
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wishlist } = req.body;

    if (!wishlist || !Array.isArray(wishlist)) {
      return res.status(400).json({ message: "Invalid wishlist data" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: { $each: wishlist } } },
        { new: true }
      )
      .populate("wishlist");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Wishlist updated successfully",
      wishlist: updatedUser.wishlist,
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

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserinfo = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User information retrieved successfully",
      user: user,
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
      user: user,
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

      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const userrole = await userModel.findById(userId);

    if (userrole.role !== "admin") {
      return res.status(403).json({ message: "You are not admin" });
    } else {
      const users = await userModel.find();
      res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const createUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userrole = await userModel.findById(userId);

    if (userrole.role !== "admin") {
      return res.status(403).json({ message: "You are not admin" });
    } else {
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
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userrole = await userModel.findById(userId);

    if (userrole.role !== "admin") {
      return res.status(403).json({ message: "You are not admin" });
    } else {
      const id = req.params.id;
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userrole = await userModel.findById(userId);

    if (userrole.role !== "admin") {
      return res.status(403).json({ message: "You are not admin" });
    } else {
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
export {
  signup,
  signin,
  verifyEmail,
  addToWishlist,
  deleteProductFromWishlist,
  getUserinfo,
  deleteUserinfo,
  updateUserinfo,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
  createUser,
  acceptOrRejectUser,
};

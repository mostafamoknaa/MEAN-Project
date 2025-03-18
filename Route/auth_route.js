// backend/routes/auth.js
import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import userModel from '../Model/user_model.js';
import jwt from 'jsonwebtoken';

const router3 = express.Router();

const CLIENT_ID = "1064443276321-i3fns9e13og305n9r38dlmmorej3dvt4.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const ANGULAR_REDIRECT = "http://localhost:4200/callback"; // Define Angular redirect
const JWT_SECRET = "iti"; 

router3.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router3.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
  
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    // Get user profile from Google
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Check if user exists in database
    let user = await userModel.findOne({ email: profile.email });
    console.log("Existing user:", user);

    if (!user) {
      // Create new user if not found
      user = new userModel({
        googleID: profile.id,
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      });
      await user.save();
      console.log("👤 New User Profile:", profile);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log("🔑 Token:", token);
    // Redirect to Angular with token
    res.redirect(`${ANGULAR_REDIRECT}?token=${token}`);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.redirect('/login');
  }
});

// router3.get('/logout', (req, res) => {
//   res.redirect('/login');
// });

export default router3;

import express from 'express';
import axios from 'axios';
import path from 'path';
import mongoose from "mongoose";
import userModel from '../MODELS/userModel.js'
const router3 = express.Router();

const CLIENT_ID = "1064443276321-i3fns9e13og305n9r38dlmmorej3dvt4.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";

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

    
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
   
   
    
    
        
     const user = new userModel({
       googleID: profile.id,  
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      });
      await user.save();
    

    console.log("👤 User Profile:", profile); 
    res.sendFile(path.resolve('public/home.html'));

    
   // res.send(`<h1>Welcome, ${profile.name}</h1><p>Email: ${profile.email}</p><img src="${profile.picture}" alt="Profile Picture">`);
  } catch (error) {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
    res.redirect('/login');
  }
});


router3.get('/logout', (req, res) => {
  res.redirect('/login');
});

export default router3;

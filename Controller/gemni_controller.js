import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();

 export const  gemnifuction =async(req,res) =>{


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    let chatHistory = [];
    const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 500 },
    });

   
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    
    chatHistory.push({ role: 'user', parts: [{ text: message }] });
    chatHistory.push({ role: 'model', parts: [{ text }] });

   
    res.json({ reply: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
 }
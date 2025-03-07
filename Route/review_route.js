import express from "express";
import { createReview, getUserAllReview, getAllReviewOfProduct, showAllReview, deleteReview } from "../Controller/review_controller.js";

export const route4 = express.Router();

import { authMiddleware } from '../Middleware/auth_token.js'


//customer can make review and rating

route4.post('/review', authMiddleware, createReview);
route4.get('/review', authMiddleware, getUserAllReview);
route4.get('/review/:id', getAllReviewOfProduct);




// //Admin can see all reviews and delete them

route4.get('/adminreview', showAllReview)
route4.delete('/review/:id', deleteReview)
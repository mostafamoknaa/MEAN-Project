import express from "express";
import { createReview, getUserAllReview, getAllReviewOfProduct, showAllReview, deleteReview } from "../Controller/review_controller.js";

export const route4 = express.Router();

import { authMiddleware } from '../Middleware/auth_token.js'


//customer can make review and rating

route4.post('/createreview', authMiddleware, createReview);
route4.get('/userreview', authMiddleware, getUserAllReview);
route4.get('/productreview/:id', getAllReviewOfProduct);




// //Admin can see all reviews and delete them

route4.get('/adminreview', showAllReview)
route4.delete('/review/:id', deleteReview)
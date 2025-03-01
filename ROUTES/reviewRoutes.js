import express from "express";
import { createReview,getUserAllReview,getAllReviewOfProduct,showAllReview,deleteReview} from "../CONTROLLER/reviewController.js";
const route4 = express.Router();

import authMiddleware from '../MIDDLEWARE/Auth_Token.js'


//customer can make review and rating


route4.post('/review',authMiddleware,createReview);

 route4.get('/review',authMiddleware,getUserAllReview);

route4.get('/review/:id',getAllReviewOfProduct);




// //Admin can see all reviews and delete them

route4.get('/adminreview',showAllReview)
route4.delete('/review/:id',deleteReview) //make it optinal

export default route4;
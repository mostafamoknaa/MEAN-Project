import ReviewModel from "../Model/review_model.js";
import { Product } from "../Model/product_model.js";
import reviewSchema from "../validations/reviewValidation.js";

const createReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        messages: error.details.map((err) => err.message),
      });
    }

    const { rating, review, product_id } = req.body;

    // Check for existing review
    const existingReview = await ReviewModel.findOne({
      user_id: req.user.id,
      product_id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You've already reviewed this product",
      });
    }

    // Create new review
    const newReview = new ReviewModel({
      rating,
      review,
      product_id,
      user_id: req.user.id,
    });

    await newReview.save();

    // Update product rating
    const reviews = await ReviewModel.find({ product_id });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = parseFloat((totalRating / reviews.length).toFixed(1));

    await Product.findByIdAndUpdate(product_id, {
      avgRating,
      reviewCount: reviews.length,
    });

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserAllReview = async (req, res) => {
  try {
    const UserID = req.user.id;
    const reviews = await ReviewModel.find({ user_id: UserID });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    } else {
      res.status(200).json({ message: "Reviews found", reviews });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

const getAllReviewOfProduct = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({
      product_id: req.params.id,
    }).populate("user_id", "name email"); // Populate user info

    if (!reviews.length) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//ADMIN
const showAllReview = async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .populate("user_id", "name")
      .populate("product_id", "name  price");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res
      .status(200)
      .json({ message: "All reviews retrieved successfully", reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewID = req.params.id;
    const review = await ReviewModel.findById(reviewID);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await ReviewModel.findByIdAndDelete(reviewID);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export {
  createReview,
  getUserAllReview,
  getAllReviewOfProduct,
  showAllReview,
  deleteReview,
};

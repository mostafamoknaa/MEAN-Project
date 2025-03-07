import Joi from "joi";

const reviewSchema = Joi.object({

    product_id: Joi.string().required().messages({
        "string.base": "Product ID must be a string.",
        "any.required": "Product ID is required."
    }),
    rating: Joi.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating cannot be more than 5.",
        "any.required": "Rating is required."
    }),
    review: Joi.string().min(3).max(500).required().messages({
        "string.base": "Review must be a text.",
        "string.min": "Review must be at least 3 characters long.",
        "string.max": "Review cannot exceed 500 characters.",
        "any.required": "Review is required."
    })
});

export default reviewSchema;
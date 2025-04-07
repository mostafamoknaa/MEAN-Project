import { Product } from "../Model/product_model.js";
import { PromoCode } from "../Model/promocode_model.js";
import mongoose from "mongoose";

// Response formatter utility
const formatResponse = (success, message, data = null, statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
  };
};

// Check if ID is valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Get all products with filtering, sorting, and pagination
 */
export const getProducts = async (req, res) => {
  try {
    const {
         search ,
         color, // New filter
      size,  // New filter
      minPrice,
      maxPrice,
      category,
      sortBy = "createdAt",
      order = "desc",
       page = 1,
      limit = 9,
      inStock,
      tags,
      status,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = {};
    let sortOptions = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
// Color filter
if (color) {
    const colorArray = color.split(",").map(c => c.trim());
    query.color = { $in: colorArray };
  }

  // Size filter
  if (size) {
    const sizeArray = size.split(",").map(s => s.trim());
    query.size = { $in: sizeArray };
  }
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // In stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
      query.isAvailable = true;
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Sorting
    const validSortFields = [
      "price",
      "createdAt",
      "avgRating",
      "name",
      "stock",
    ];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    // Count total documents for pagination
    const total = await Product.countDocuments(query);

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name");

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (products.length === 0) {
      return res
        .status(404)
        .json(
          formatResponse(
            false,
            "No products found matching your criteria.",
            null,
            404
          )
        );
    }

    res.status(200).json(
      formatResponse(true, "Products retrieved successfully", {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json(
        formatResponse(false, "Server error while fetching products", null, 500)
      );
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json(formatResponse(false, "Invalid product ID format", null, 400));
    }

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res
        .status(404)
        .json(formatResponse(false, "Product not found", null, 404));
    }

    res
      .status(200)
      .json(formatResponse(true, "Product retrieved successfully", product));
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res
      .status(500)
      .json(
        formatResponse(false, "Server error while fetching product", null, 500)
      );
  }
};

/**
 * Create new product
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = new Product(productData);
    const validationError = newProduct.validateSync();

    if (validationError) {
      const errorMessages = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            "Validation error",
            { errors: errorMessages },
            400
          )
        );
    }

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json(
        formatResponse(true, "Product created successfully", savedProduct, 201)
      );
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            `Duplicate value for ${Object.keys(error.keyPattern).join(", ")}`,
            null,
            400
          )
        );
    }

    res
      .status(500)
      .json(
        formatResponse(false, "Server error while creating product", null, 500)
      );
  }
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json(formatResponse(false, "Invalid product ID format", null, 400));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json(formatResponse(false, "Product not found", null, 404));
    }

    res
      .status(200)
      .json(
        formatResponse(true, "Product updated successfully", updatedProduct)
      );
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            "Validation error",
            { errors: errorMessages },
            400
          )
        );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            `Duplicate value for ${Object.keys(error.keyPattern).join(", ")}`,
            null,
            400
          )
        );
    }

    res
      .status(500)
      .json(
        formatResponse(false, "Server error while updating product", null, 500)
      );
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json(formatResponse(false, "Invalid product ID format", null, 400));
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json(formatResponse(false, "Product not found", null, 404));
    }

    res
      .status(200)
      .json(formatResponse(true, "Product deleted successfully", null));
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json(
        formatResponse(false, "Server error while deleting product", null, 500)
      );
  }
};

/**
 * Get products in stock
 */
export const getStockAvailability = async (req, res) => {
  try {
    const inStockProducts = await Product.find({
      stock: { $gt: 0 },
      isAvailable: true,
    });

    if (inStockProducts.length === 0) {
      return res
        .status(404)
        .json(
          formatResponse(false, "No products currently in stock", null, 404)
        );
    }

    res
      .status(200)
      .json(
        formatResponse(
          true,
          "In-stock products retrieved successfully",
          inStockProducts
        )
      );
  } catch (error) {
    console.error("Error fetching in-stock products:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while fetching in-stock products",
          null,
          500
        )
      );
  }
};

/**
 * Get stock availability for a specific product
 */
export const getStockAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json(formatResponse(false, "Invalid product ID format", null, 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json(formatResponse(false, "Product not found", null, 404));
    }

    const stockInfo = {
      productId: product._id,
      name: product.name,
      stock: product.stock,
      isAvailable: product.isAvailable,
      inStock: product.stock > 0 && product.isAvailable,
    };

    res
      .status(200)
      .json(
        formatResponse(
          true,
          "Stock information retrieved successfully",
          stockInfo
        )
      );
  } catch (error) {
    console.error("Error fetching stock availability:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while fetching stock availability",
          null,
          500
        )
      );
  }
};

/**
 * Check promo code validity and get discount
 */
export const checkPromoCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json(formatResponse(false, "Promo code is required", null, 400));
    }

    const promoCode = await PromoCode.findOne({
      code: code.trim().toUpperCase(),
      status: "active",
    });

    if (!promoCode) {
      return res
        .status(404)
        .json(
          formatResponse(false, "Promo code not found or inactive", null, 404)
        );
    }

    const today = new Date();

    // Check if promo code is expired
    if (promoCode.expiry && today > new Date(promoCode.expiry)) {
      return res
        .status(400)
        .json(formatResponse(false, "Promo code has expired", null, 400));
    }

    // Check if promo code has reached usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return res
        .status(400)
        .json(
          formatResponse(false, "Promo code usage limit reached", null, 400)
        );
    }

    // Construct response with promo code details
    const promoDetails = {
      code: promoCode.code,
      discount: promoCode.discount,
      discountType: promoCode.discountType || "percentage",
      minPurchase: promoCode.minPurchase || 0,
      expiry: promoCode.expiry,
    };

    res
      .status(200)
      .json(formatResponse(true, "Valid promo code", promoDetails));
  } catch (error) {
    console.error("Error checking promo code:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while checking promo code",
          null,
          500
        )
      );
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featuredProducts = await Product.find({
      isFeatured: true,
      isAvailable: true,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    if (featuredProducts.length === 0) {
      return res
        .status(404)
        .json(formatResponse(false, "No featured products found", null, 404));
    }

    res
      .status(200)
      .json(
        formatResponse(
          true,
          "Featured products retrieved successfully",
          featuredProducts
        )
      );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while fetching featured products",
          null,
          500
        )
      );
  }
};

/**
 * Get products on sale
 */
export const getProductsOnSale = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const productsOnSale = await Product.findOnSale()
      .where({ isAvailable: true, status: "active" })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    if (productsOnSale.length === 0) {
      return res
        .status(404)
        .json(formatResponse(false, "No products on sale found", null, 404));
    }

    // Add sale percentage to each product
    const productsWithSaleInfo = productsOnSale.map((product) => {
      const productObj = product.toObject();
      productObj.salePercentage = product.getSalePercentage();
      return productObj;
    });

    res
      .status(200)
      .json(
        formatResponse(
          true,
          "Products on sale retrieved successfully",
          productsWithSaleInfo
        )
      );
  } catch (error) {
    console.error("Error fetching products on sale:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while fetching products on sale",
          null,
          500
        )
      );
  }
};

/**
 * Get all products (simplified version for admin panel)
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        formatResponse(true, "All products retrieved successfully", products)
      );
  } catch (error) {
    console.error("Error fetching all products:", error);
    res
      .status(500)
      .json(
        formatResponse(
          false,
          "Server error while fetching all products",
          null,
          500
        )
      );
  }
};

// Export for backward compatibility with the original code
export const checkCoupon = checkPromoCode;
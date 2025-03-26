# E-Commerce Platform (Node.js & MongoDB)

## Overview
This is a complete e-commerce backend built using **Node.js** and **Express.js**, with **MongoDB Atlas** as the database. It supports user authentication, product management, order handling, payments, and an admin panel.

## Features
### 1. User Management
- User registration & login (Email, Phone, Social Media)
- Profile management (name, address, payment details, etc.)
- Multi-user roles (Customer, Seller, Admin)
- Wishlist
- Order history 
- Reviews & Ratings

### 2. Product Management
- Categories
- Product listings with images, descriptions, and prices
- Stock availability
- Search & filter by name, price, and category

### 3. Shopping Cart & Checkout
- Add/remove items from cart
- Quantity adjustment
- Guest checkout option
- Multiple payment methods (Credit card, stripe, Cash on Delivery)
- Apply promo codes and discounts

### 4. Order Management
- Order placement & confirmation
- Order tracking with status updates


### 5. Payment Integration
- Secure payment gateway (Stripe)
- Card saving & auto-fill for quick checkout

### 6. Admin Panel Features
- User management (approve/restrict users)
- Product & category management
- Order & shipping management
- Discounts & promo code management
- Content management for banners & homepage

### 7. Seller (Vendor) Management
- Seller registration & profile setup
- Product listing & inventory management


## API Endpoints
### 1. User Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/signup` | User registration |
| POST | `/login` | User login |
| GET  | `/verify/:email` | Verify email |
| GET  | `/getuserinfo` | Get user profile (auth required) |
| PUT  | `/updateuserinfo` | Update user profile (auth required) |
| DELETE | `/deleteuserinfo` | Delete user account (auth required) |

### 2. Admin Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/users` | Get all users (admin required) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create a new user (admin required) |
| PUT | `/users/:id` | Update user (admin required) |
| DELETE | `/users/:id` | Delete user (admin required) |

### 3. Product Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/product` | Create a new product (seller required) |
| GET  | `/product` | Get all products of a seller (auth required) |
| GET  | `/allproduct` | Get all products (public) |
| PUT  | `/product/:id` | Update a product (seller required) |
| DELETE | `/product/:id` | Delete a product (seller required) |

### 4. Order Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | `/getallorders` | Get all orders (auth required) |
| POST | `/order` | Create an order (auth required) |
| GET  | `/getAllOrdersofUser` | Get user orders (auth required) |
| PUT  | `/order/:id` | Update an order (auth required) |
| DELETE | `/order/:id` | Delete an order (auth required) |

### 5. Wishlist Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/addtowishlist` | Add product to wishlist (auth required) |
| DELETE | `/deletefromwishlist/:id` | Remove product from wishlist (auth required) |

### 6. Cart Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | `/getusercart/:userid` | Get user cart |
| POST | `/addtocart` | Add item to cart |
| PUT  | `/updatecartquantity` | Update cart item quantity |
| DELETE | `/deletefromcart/:userid` | Remove item from cart |
| POST | `/gustuser` | Guest user checkout |
| POST | `/processpayment/:userid` | Process payment |
| POST | `/applypromocode/:userid` | Apply promo code |

### 7. Seller Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/createseller` | Register a new seller (auth required) |

### 8. Review Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/review` | Create a review (auth required) |
| GET  | `/review` | Get all user reviews (auth required) |
| GET  | `/review/:id` | Get all reviews of a product |
| GET  | `/adminreview` | Admin can see all reviews |
| DELETE | `/review/:id` | Admin can delete a review |

### 9. Promo Code Routes
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/createpromocode` | Create a promo code |
| DELETE | `/deletepromocode/:id` | Delete a promo code |

## Installation & Setup
### Prerequisites
- **Node.js** installed
- **MongoDB Atlas** account set up

### Steps to Run
1. **Clone the repository**
   ```sh
   git clone <https://github.com/mostafamoknaa/MEAN-Project.git>
   cd e-commerce-backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Run the server**
   ```sh
   npm start
   ```


# 📱 E-Shop - E-Commerce Backend API

## 🌟 Introduction

E-Shop is a robust and feature-rich e-commerce backend API built with Node.js and Express.js. This RESTful API provides comprehensive functionality for managing an online shopping platform, including user authentication, product management, shopping cart operations, wishlist features, and order processing with inventory management. The application follows the MVC (Model-View-Controller) architecture pattern and implements secure authentication using JWT tokens.

## ✨ Features

- 🔐 **User Authentication & Authorization**
  - User registration and login with JWT tokens
  - Password reset functionality via email
  - Role-based access control (User & Admin)
  - Secure password hashing with bcrypt

- 🛍️ **Product Management**
  - Create, read, update, and delete products
  - Product search functionality
  - Slug-based product fetching

- 🛒 **Shopping Cart**
  - Add/remove items from cart
  - Update cart item quantities
  - Clear entire cart
  - Move items from cart to wishlist

- ❤️ **Wishlist**
  - Add/remove products to wishlist
  - View all wishlist items
  - Clear entire wishlist

- 📦 **Order Management**
  - Create orders with automatic stock management
  - Order tracking system
  - Cancel orders (with stock restoration)
  - Order history for users
  - Admin order management with pagination
  - Email notifications for order confirmation

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer
- **Environment Variables:** dotenv
- **CORS:** cors middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/KhuzaimaKhalid/E-Shop.git
cd E-Shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/eshop
JWT_SECRET=your_jwt_secret_key
EMAIL_FROM=your_email@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. **Start the server**
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📮 Postman Routes

### 👤 User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/set-password-reset-email` | Send password reset email | ❌ |
| POST | `/reset-password/:id/:token` | Reset password with token | ❌ |
| POST | `/change-user-password` | Change logged-in user password | ✅ |
| GET | `/loggedUser` | Get logged-in user details | ✅ |

**Register Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "phone": "+1234567890",
  "isAdmin": false
}
```

### 🛍️ Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/createProducts` | Create a new product | ❌ |
| GET | `/fetchProducts/slug/:slug` | Fetch product by slug | ❌ |
| PUT | `/updateProducts/:id` | Update product by ID | ❌ |
| POST | `/deleteProducts/:id` | Delete product by ID | ❌ |
| GET | `/search` | Search products with query params | ❌ |

**Create Product Example:**
```json
{
  "name": "iPhone 14 Pro",
  "slug": "iphone-14-pro",
  "description": "Latest iPhone model",
  "price": 999,
  "stock": 50,
  "category": "Electronics",
  "images": ["image1.jpg", "image2.jpg"]
}
```

### ❤️ Wishlist Routes (`/api/wishlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addToWishlist` | Add product to wishlist | ✅ |
| POST | `/deleteWishlist/:id` | Remove item from wishlist | ✅ |
| GET | `/fetchWishlist` | Get user's wishlist | ✅ |
| POST | `/clearWishlist` | Clear entire wishlist | ✅ |

**Add to Wishlist Example:**
```json
{
  "products": "product_id_here"
}
```

### 🛒 Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addToCart` | Add item to cart | ✅ |
| GET | `/fetchCart` | Get user's cart | ✅ |
| POST | `/deleteCart/:id` | Remove item from cart | ✅ |
| PUT | `/updateCart/:id` | Update cart item quantity | ✅ |
| POST | `/clearCart` | Clear entire cart | ✅ |
| POST | `/addCartItemToWishlist/:itemId` | Move cart item to wishlist | ✅ |

**Add to Cart Example:**
```json
{
  "products": "product_id_here",
  "quantity": 2
}
```

### 📦 Order Routes (`/api/order`)

#### 👨‍💼 User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/createOrder` | Create a new order | ✅ |
| GET | `/getOrder` | Get user's orders | ✅ |
| GET | `/getSpecificOrder/:id` | Get specific order by ID | ✅ |
| POST | `/cancelOrder/:id` | Cancel an order | ✅ |
| POST | `/tracker/:id` | Track order status | ✅ |

**Create Order Example:**
```json
{
  "user": "user_id_here",
  "items": [
    {
      "product": {
        "id": "product_id_here",
        "name": "Product Name"
      },
      "quantity": 2
    }
  ],
  "selectedAddress": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "paymentMethod": "Credit Card",
  "paymentStatus": "Pending"
}
```

#### 🔑 Admin Routes (Requires Admin Authentication)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/fetchOrder` | Fetch all orders (with pagination) | ✅ Admin |
| GET | `/fetchOrderById/:id` | Fetch specific order | ✅ Admin |
| PUT | `/updateOrderStatus/:id` | Update order status | ✅ Admin |
| PUT | `/updateOrder/:id` | Update order details | ✅ Admin |
| POST | `/deleteOrder/:id` | Delete an order | ✅ Admin |

**Query Parameters for fetchOrder:**
```
?page=1&limit=50
```

**Update Order Status Example:**
```json
{
  "status": "Shipped"
}
```

### 🔑 Authentication

For protected routes, include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## 🏗️ Project Structure

```
E-Shop/
│
├── config/
│   ├── connectdb.js         # Database connection
│   └── emailConfig.js       # Email configuration
│
├── controllers/
│   ├── userController.js    # User operations
│   ├── productsController.js # Product operations
│   ├── cartController.js    # Cart operations
│   ├── wishlistController.js # Wishlist operations
│   └── orderController.js   # Order operations
│
├── middlewares/
│   ├── authMiddleware.js    # JWT authentication
│   ├── adminMiddleware.js   # Admin authorization
│   └── sanitizedObject.js   # Query sanitization
│
├── models/
│   ├── user.js             # User schema
│   ├── products.js         # Product schema
│   ├── cart.js            # Cart schema
│   ├── wishlist.js        # Wishlist schema
│   └── order.js           # Order schema
│
├── routes/
│   ├── userRoutes.js      # User routes
│   ├── productRoutes.js   # Product routes
│   ├── cartRoutes.js      # Cart routes
│   ├── wishlistRoutes.js  # Wishlist routes
│   └── orderRoutes.js     # Order routes
│
├── .gitignore
├── app.js                 # Main application file
├── package.json
└── ecommerce_ERD.drawio   # Database ERD diagram
```

---

Made with ❤️ by [Khuzaima Khalid](https://github.com/KhuzaimaKhalid)

# Eshterely Backend - Information Technology Institute (ITI)

This is the backend server for the Eshterely platform, built using Node.js, Express, and MongoDB. It provides RESTful API endpoints for product discovery (headphones, speakers, soundbars, televisions), user management, authentication, cart, and order processing.

## Table of contents

- Overview
  - Features
  - API Endpoints
  - Links
- Architecture
  - Built with
  - Project Structure
- Models
- Authentication
- Validation
- Services
- Authors

## Overview

### Features

- User Management: Registration, authentication, profile management
- Product Catalog: Browse, search, and filter products (headphones, speakers, soundbars, televisions)
- Cart Management: Add/remove products from user cart
- Order Processing: Create and manage orders
- Authentication: JWT-based authentication with password reset functionality and Google OAuth
- Admin Access: Special routes for administrative functions
- Data Validation: Schema-based validation for all data models

### API Endpoints

- **Authentication**

  - `POST /api/auth/register` : User registration
  - `POST /api/auth/login` : User login
  - `POST /api/auth/forgot-password` : Request password reset
  - `POST /api/auth/reset-password/:token` : Reset password with token
  - `POST /api/auth/google` : Google OAuth authentication

- **Users**

  - `GET /api/users` : Get all users (admin only)
  - `GET /api/users/me` : Get current user profile
  - `DELETE /api/users/:id` : Delete user by ID (admin only)

- **Products**

  - `GET /api/headphones` : Get all headphones
  - `GET /api/headphones/:id` : Get headphone by ID
  - `POST /api/headphones` : Create new headphone
  - `PATCH /api/headphones/:id` : Update headphone
  - `DELETE /api/headphones/:id` : Delete headphone

  - `GET /api/speakers` : Get all speakers
  - `GET /api/speakers/:id` : Get speaker by ID
  - `POST /api/speakers` : Create new speaker
  - `PATCH /api/speakers/:id` : Update speaker
  - `DELETE /api/speakers/:id` : Delete speaker

  - `GET /api/soundbars` : Get all soundbars
  - `GET /api/soundbars/:id` : Get soundbar by ID
  - `POST /api/soundbars` : Create new soundbar
  - `PATCH /api/soundbars/:id` : Update soundbar
  - `DELETE /api/soundbars/:id` : Delete soundbar

  - `GET /api/televisions` : Get all televisions
  - `GET /api/televisions/:id` : Get television by ID
  - `POST /api/televisions` : Create new television
  - `PATCH /api/televisions/:id` : Update television (admin only)
  - `DELETE /api/televisions/:id` : Delete television (admin only)

- **Cart**

  - `GET /api/cart` : Get user's cart
  - `PUT /api/cart` : Add/update product in cart
  - `DELETE /api/cart/:productId` : Remove product from cart

- **Orders**
  - `GET /api/orders` : Get all orders (user)
  - `GET /api/orders/:id` : Get order by ID
  - `POST /api/orders` : Create new order
  - `PUT /api/orders/:id` : Update order
  - `PATCH /api/orders/:id/status` : Update order status
  - `DELETE /api/orders/:id` : Delete order

### Links

- Backend Solution URL: [https://github.com/Youssef-Yasser-Mahmoud/Eshterely-backend]
- Live Back-end URL: [https://eshterely.up.railway.app/]
- Frontend Solution URL: [https://github.com/AhmedShebl2000/Eshterely-Frontend]
- Live Site URL: [https://eshtrely.netlify.app/]

## Architecture

### Built with

- Node.js - JavaScript runtime
- Express - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT - JSON Web Tokens for authentication
- AJV - JSON Schema validator
- bcrypt - Password hashing
- Axios - HTTP client
- Nodemailer - Email sending
- Google Auth Library - Google authentication
- Helmet - Security middleware
- Compression - Response compression

### Project Structure

```
.
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── startup/
├── validations/
├── index.js
├── package.json
├── .env
└── README.md
```

## Models

### User

- Personal information (first name, last name, email)
- Password (hashed)
- Admin status
- Cart
- Previously purchased items
- Password reset functionality

### Product (Headphones, Speakers, Soundbars, Televisions)

- Product details (name, category, sub_category, image, price, etc.)
- Media (images, banners)
- Colors and variants
- Warranty and descriptions
- Details/specifications

### Order

- User reference
- Order items (products, quantity, price)
- Shipping information
- Order status
- Pricing (total)
- Metadata

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Token Generation: Upon successful login, a JWT token is generated containing the user's ID and admin status
- Token Verification: Protected routes use middleware to verify the token
- Password Reset: Secure password reset flow with tokenized email links
- Google OAuth: Support for Google authentication
- Admin Access: Special middleware to restrict routes to admin users

## Validation

All data models are validated using AJV (Another JSON Validator):

- Schema Definitions: JSON schemas defined for all models
- Request Validation: Incoming requests validated against schemas
- Error Handling: Detailed validation error messages

## Services

### Email Service

- Password reset emails

## Authors

- Youssef Yasser

  - [GitHub](https://github.com/Youssef-Yasser-Mahmoud)
  - [LinkedIn](https://www.linkedin.com/in/youssef-yasser-mahmoud/)

- Kareem Ehab

  - [GitHub](https://github.com/KareemEhab)
  - [LinkedIn](https://www.linkedin.com/in/kareem-hamouda/)

- Mahmoud Mohamed

  - [GitHub](https://github.com/mahmoud1mandour)
  - [LinkedIn](https://www.linkedin.com/in/mahmoud1mandour/)

- Ahmed Shebl

  - [GitHub](https://github.com/AhmedShebl2000)
  - [LinkedIn](https://www.linkedin.com/in/ahmedshebl16/)

- Youssef Salem
  - [GitHub](https://github.com/YoussefSallem)
  - [LinkedIn](https://www.linkedin.com/in/yousseffsalem/)

# 💊 Medicare — Online Pharmacy Web Application

Medicare is a web-based application that allows users to browse, search, and purchase medicines online — removing the need for physical pharmacy visits and offering a convenient, accessible, and centralized digital platform for medicine management.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Scope](#scope)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Collections](#database-collections)
- [Team](#team)

---

## 📖 Overview

Traditional pharmacies require customers to physically visit stores — inconvenient for elderly or sick patients, and lacking any centralized system for managing inventory, orders, and customer data. Medicare solves this with a simple, full-stack online pharmacy platform.

---

## ❗ Problem Statement

There is a lack of centralized digital systems for managing medicine inventory, orders, and customer data efficiently. Medicare addresses this with a user-friendly frontend and a robust backend built on modern web technologies.

---

## 🎯 Objectives

- Develop an online platform for browsing and purchasing medicines
- Provide secure backend APIs for handling users, products, and orders
- Store and manage pharmacy data efficiently using a database
- Implement a simple and responsive frontend for users
- Demonstrate full-stack development using modern web technologies

---

## 🔭 Scope

**Included:**
- Browsing available medicines
- Viewing medicine details (price, description)
- Adding medicines to cart and placing orders
- Backend APIs for managing medicines and orders
- Database storage using MongoDB

**Not included:**
- Online payment gateway integration
- Prescription verification by doctors
- Mobile application support

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose ODM

---

## 🏗️ System Architecture

The system follows a client-server architecture:

```
Frontend (HTML/CSS/JS) ⇄ Backend (Node.js + Express REST API) ⇄ MongoDB (Mongoose)
```

---

## 📂 Project Structure

```
medicare/
├── Backend/
│   ├── server.js
│   ├── mongo.js
│   ├── package.json
|   ├── package-lock.json
|   ├── seedProduct.js
|   ├── test-server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   └── routes/
│       ├── cartRoutes.js
│       ├── orderRoutes.js
│       ├── productRoutes.js
│       └── userRoutes.js
│
└── Frontend/
    ├── index.html         (Home Page)
    ├── login.html         (Login/Register Page)
    ├── shop.html          (Shop Page)
    ├── cart.html          (Cart Page)
    ├── checkout.html      (Checkout Page)
    ├── about.html         (About Page)
    ├── contact.html       (Contact Form Page)
    ├── product.html       (Products Page)
    ├── profile.html       (Profile Page)
    ├── register.html      (Registration Page)
    └── js/
        ├── auth.js
        └── cart-count.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/asna-154/MediCare.git
cd medicare
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Run the backend:
```bash
node server.js
```

### 3. Frontend

The frontend is plain HTML/CSS/JS served alongside the backend. Open `index.html` in your browser, or serve it through the Express static middleware if configured in `server.js`.

The app will be available at `http://127.0.0.1:3000`.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/products` | Fetch all products (medicines) |
| POST | `/api/products` | Add a new product |
| DELETE | `/api/products` | Delete a product |
| GET | `/api/orders` | Fetch all orders |
| POST | `/api/orders` | Place a new order |
| GET | `/api/cart` | Fetch cart details |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update cart item (increase/decrease) |
| GET | `/api/cart/count` | Get current cart item count |
| GET | `/api/users` | Fetch users |
| POST | `/api/users` | Add a new user |

---

## 🗄️ Database Collections

| Collection | Description |
|------------|--------------|
| `products` | Stores medicine details (name, price, description) |
| `carts` | Stores user cart items |
| `orders` | Stores placed orders with shipping address and payment method |
| `users` | Stores registered user accounts |

---

## 👥 Team

| Name | Contribution |
|------|--------------|
| Asna Hammad | Backend architecture (Express server setup, REST API routes for products, orders, and users), MongoDB schema design (Product, Order, User models), Postman API testing, database integration |
| Fizzah Farooq | Frontend development (Home, Login/Register, Shop pages), cart and checkout logic (JavaScript event handling, dynamic cart updates), UI/UX styling with CSS |

---

## 📄 License

This project was developed for academic purposes as part of a university course assignment.

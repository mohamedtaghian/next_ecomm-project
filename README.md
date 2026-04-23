# FreshCart — Next.js + Own Backend

Full-stack e-commerce app with **Next.js 14 App Router**, **MongoDB**, and a built-in REST API.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `EMAIL_*` — SMTP credentials (Gmail App Password works)

### 3. Seed the database
```bash
npm run seed
```
Creates admin user, 6 categories, 5 brands, 12 products.

**Admin credentials after seed:**
```
Email:    admin@freshcart.com
Password: Admin@1234
```

### 4. Run
```bash
npm run dev        # http://localhost:3000
```

---

## 🗂️ Architecture

```
src/
├── app/
│   ├── api/                  ← REST API (Next.js Route Handlers)
│   │   ├── auth/             ← register, login, forgot/reset password
│   │   ├── products/         ← CRUD (admin write)
│   │   ├── categories/       ← CRUD (admin write)
│   │   ├── brands/           ← CRUD (admin write)
│   │   ├── cart/             ← add, update, remove, clear
│   │   ├── wishlist/         ← add, remove
│   │   ├── orders/           ← place, list, update status
│   │   └── users/            ← list, role change, soft delete (admin)
│   │
│   ├── admin/                ← Admin Panel (protected)
│   │   ├── page.jsx          ← Dashboard with live stats
│   │   ├── products/         ← Create/edit/delete products
│   │   ├── categories/       ← Manage categories
│   │   ├── brands/           ← Manage brands
│   │   ├── users/            ← Activate/deactivate/promote users
│   │   └── orders/           ← View & update order status
│   │
│   └── (storefront pages)    ← Home, Products, Cart, Wishlist, etc.
│
├── models/                   ← Mongoose schemas
│   ├── User.js               ← bcrypt hashed password, roles, wishlist
│   ├── Product.js            ← title, price, stock, images, ratings
│   ├── Category.js / Brand.js
│   ├── Cart.js               ← auto-calculated total
│   ├── Order.js              ← status tracking, shipping address
│   └── Review.js             ← auto-recalculates product rating
│
├── lib/
│   ├── db.js                 ← MongoDB singleton connection
│   ├── auth.js               ← JWT sign/verify, authenticate(), requireAdmin()
│   ├── apiClient.js          ← Axios instance + typed API modules
│   ├── apiResponse.js        ← apiSuccess / apiError helpers
│   └── email.js              ← Nodemailer + email templates
│
├── context/                  ← React Context (Auth, Cart, Wishlist)
├── components/               ← UI components
└── scripts/seed.js           ← Database seeder
```

---

## 🔐 Auth & Roles

| Role | Can do |
|---|---|
| `customer` | Browse, cart, wishlist, place orders |
| `admin` | Everything + manage products/categories/brands/users/orders |

Token is stored in `localStorage` and sent as `Authorization: Bearer <token>` header on every API call.

---

## 📡 API Reference

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify-token
POST   /api/auth/forgot-password
POST   /api/auth/verify-reset-code
PUT    /api/auth/reset-password
```

### Products
```
GET    /api/products               ?page=1&keyword=apple&category=<id>&brand=<id>
POST   /api/products               (admin)
GET    /api/products/:id
PUT    /api/products/:id           (admin)
DELETE /api/products/:id           (admin)
```

### Categories & Brands
```
GET/POST  /api/categories
GET/PUT/DELETE /api/categories/:id   (write = admin)

GET/POST  /api/brands
GET/PUT/DELETE /api/brands/:id       (write = admin)
```

### Cart
```
GET    /api/cart
POST   /api/cart          { productId }
PUT    /api/cart/:productId   { count }
DELETE /api/cart/:productId
DELETE /api/cart              (clear all)
```

### Wishlist
```
GET    /api/wishlist
POST   /api/wishlist      { productId }
DELETE /api/wishlist/:productId
```

### Orders
```
POST   /api/orders              { cartId, shippingAddress }
GET    /api/orders              (admin = all, user = own)
GET    /api/orders/user/:userId
GET    /api/orders/:id
PUT    /api/orders/:id          { status, isPaid, isDelivered } (admin)
```

### Users (admin)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id     { role, active }
DELETE /api/users/:id     (soft delete — sets active: false)
```

---

## 🛠️ Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer |
| Styling | Tailwind CSS v3 |
| Forms | Formik + Yup |
| HTTP client | Axios |
| Sliders | Swiper |
| Icons | React Icons |
| Toasts | React Hot Toast |

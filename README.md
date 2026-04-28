# 🛒 FreshCart — Next.js E-Commerce

A full-stack grocery & electronics e-commerce app built with Next.js App Router, MongoDB, and Tailwind CSS. Includes a complete REST API, JWT authentication, admin dashboard, cart, wishlist, and order management — all in one project.

**Live demo:** [next-ecomm-project.vercel.app](https://next-ecomm-project.vercel.app)

---

## Tech Stack

|                  |                                        |
| ---------------- | -------------------------------------- |
| **Framework**    | Next.js (App Router)                   |
| **Database**     | MongoDB Atlas + Mongoose               |
| **Auth**         | JWT + bcryptjs                         |
| **Styling**      | Tailwind CSS                           |
| **HTTP Client**  | Axios                                  |
| **Forms**        | Formik + Yup                           |
| **Email**        | Nodemailer                             |
| **Image Upload** | Cloudinary                             |
| **UI**           | Swiper · React Hot Toast · React Icons |

---

## Prerequisites

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **MongoDB Atlas** free account → [cloud.mongodb.com](https://cloud.mongodb.com)

```bash
node -v   # v18.x.x or higher
npm -v    # 9.x.x or higher
```

---

## Local Development Setup

### 1 — Install dependencies

```bash
npm install
```

---

### 2 — Set up MongoDB Atlas

**2.1 Create a free cluster**

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com) (no credit card needed)
2. Click **Build a Database → M0 Free**
3. Pick any provider — for Egypt choose **AWS / Milan (eu-south-1)** or **AWS / Bahrain (me-south-1)**
4. Name your cluster (e.g. `freshcart`) → click **Create**

**2.2 Create a database user**

Go to **Security → Database Access → Add New Database User**

- Username: `freshcart_user`
- Password: click **Autogenerate Secure Password** and copy it
- Role: `Atlas Admin`
- Click **Add User**

**2.3 Whitelist your IP**

Go to **Security → Network Access → Add IP Address**

- Click **Allow Access from Anywhere** → adds `0.0.0.0/0`
- Click **Confirm**

**2.4 Copy your connection string**

Go to **Database → Connect → Drivers → Node.js** and copy the string:

```
mongodb+srv://freshcart_user:<password>@freshcart.xxxxx.mongodb.net/
```

Replace `<password>` with the password from step 2.2.

---

### 3 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
# ── Required ──────────────────────────────────────────────────────────────────

# Add /freshcart before the ? — Atlas will create this database automatically
MONGODB_URI=mongodb+srv://freshcart_user:YOUR_PASSWORD@freshcart.xxxxx.mongodb.net/freshcart?retryWrites=true&w=majority

# Any long random string — keep it secret
JWT_SECRET=your_long_random_secret_string_here
JWT_EXPIRES_IN=7d

# Your app's base URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# ── Optional (needed for password reset) ──────────────────────────────────────
# Use a Gmail App Password — NOT your regular Gmail password
# Guide: https://support.google.com/accounts/answer/185833
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=FreshCart <your_email@gmail.com>

# ── Optional (needed for image uploads in admin panel) ────────────────────────
# Get credentials at: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> The app runs fully without Email and Cloudinary. Add them later when needed.

---

### 4 — Seed the database

```bash
npm run seed
```

Expected output:

```
🌱  Connecting to MongoDB...
✅  Connected

🗑️   Cleared existing data

👤  Admin created: admin@freshcart.com
    Password: Admin@1234

📂  Created 6 categories
🏷️   Created 5 brands
📦  Created 12 products

✅  Seed complete!
─────────────────────────────────
Admin login:
  Email:    admin@freshcart.com
  Password: Admin@1234
  Role:     admin
─────────────────────────────────
```

> ⚠️ Re-running this command **wipes all data** and starts fresh. Only use it to reset.

---

### 5 — Start the dev server

```bash
rm -rf .next    # clear stale cache on first run
npm run dev
```

Open **http://localhost:3000**

---

## Seed Data Reference

### Admin account

|              |                     |
| ------------ | ------------------- |
| **Email**    | admin@freshcart.com |
| **Password** | Admin@1234          |
| **Role**     | admin               |

---

### Categories (6)

| #   | Name          |
| --- | ------------- |
| 1   | Electronics   |
| 2   | Fresh Produce |
| 3   | Dairy & Eggs  |
| 4   | Bakery        |
| 5   | Beverages     |
| 6   | Snacks        |

---

### Brands (5)

| #   | Name    |
| --- | ------- |
| 1   | Apple   |
| 2   | Samsung |
| 3   | Nestlé  |
| 4   | Danone  |
| 5   | PepsiCo |

---

### Products (12)

| Product                       | Category      |      Price |   Discount | Stock |
| ----------------------------- | ------------- | ---------: | ---------: | ----: |
| iPhone 15 Pro                 | Electronics   | 45,000 EGP |          — |    50 |
| Samsung Galaxy S24            | Electronics   | 38,000 EGP | 34,000 EGP |    30 |
| Organic Apples (1kg)          | Fresh Produce |     45 EGP |          — |   200 |
| Fresh Strawberries (500g)     | Fresh Produce |     60 EGP |     49 EGP |   100 |
| Full Fat Milk (1L)            | Dairy & Eggs  |     28 EGP |          — |   300 |
| Free-Range Eggs (12pk)        | Dairy & Eggs  |     75 EGP |          — |   150 |
| Sourdough Bread Loaf          | Bakery        |     55 EGP |          — |    80 |
| Croissants (4pk)              | Bakery        |     40 EGP |     32 EGP |    60 |
| Pepsi 500ml (6pk)             | Beverages     |     80 EGP |          — |   500 |
| Nestlé Pure Life Water (12pk) | Beverages     |     45 EGP |          — |   400 |
| Mixed Nuts (300g)             | Snacks        |    120 EGP |          — |   120 |
| Dark Chocolate Bar (100g)     | Snacks        |     65 EGP |     55 EGP |    90 |

Each product has a randomly generated rating (3.0–5.0) and ratings count (0–200).

---

## Admin Panel

Access the admin dashboard at `/admin` after logging in with the admin account.

### Dashboard `/admin`

Shows 5 live stat cards — Products, Categories, Brands, Users, Orders. Each card links to its management page.

### Products `/admin/products`

- View all products in a table with name, price, stock, category, brand
- Add new products (title, description, price, discount price, stock, image, category, brand)
- Edit or delete any product

### Categories `/admin/categories`

- View all categories with images
- Add, edit, or delete categories

### Brands `/admin/brands`

- View all brands with logos
- Add, edit, or delete brands

### Users `/admin/users`

- View all registered users with role and status
- Promote a customer to admin
- Deactivate or reactivate any user

### Orders `/admin/orders`

- View all orders from all customers
- Update order status: `pending → processing → shipped → delivered`
- Mark orders as paid or delivered

### Roles

| Capability                            | Customer | Admin |
| ------------------------------------- | :------: | :---: |
| Browse products, categories, brands   |    ✅    |  ✅   |
| Add to cart & wishlist                |    ✅    |  ✅   |
| Place orders                          |    ✅    |  ✅   |
| View own orders                       |    ✅    |  ✅   |
| Access `/admin` dashboard             |    ❌    |  ✅   |
| Manage products / categories / brands |    ❌    |  ✅   |
| View & manage all users               |    ❌    |  ✅   |
| View & update all orders              |    ❌    |  ✅   |

---

## Project Structure

```
freshcart-nextjs/
├── .env.local                    ← Your secrets (never commit this)
├── .env.local.example            ← Template — copy to .env.local
├── next.config.js                ← Image domains + CORS headers
├── scripts/
│   └── seed.js                   ← Run with: npm run seed
│
└── src/
    ├── middleware.js              ← Server-side route protection
    │
    ├── app/
    │   ├── api/                   ← All REST API routes
    │   │   ├── auth/              ← register, login, verify-token, forgot-password, reset
    │   │   ├── products/
    │   │   ├── categories/
    │   │   ├── brands/
    │   │   ├── cart/
    │   │   ├── wishlist/
    │   │   ├── orders/
    │   │   ├── users/
    │   │   └── upload/            ← Cloudinary image upload
    │   │
    │   ├── admin/                 ← Admin panel pages (admin role required)
    │   │   ├── page.jsx           ← Dashboard
    │   │   ├── products/
    │   │   ├── categories/
    │   │   ├── brands/
    │   │   ├── users/
    │   │   └── orders/
    │   │
    │   ├── login/
    │   ├── register/
    │   ├── products/
    │   ├── product-details/[id]/
    │   ├── cart/
    │   ├── whish-list/
    │   ├── allorders/
    │   ├── forgot-password/
    │   ├── verify-reset-code/
    │   └── reset-password/
    │
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Category.js
    │   ├── Brand.js
    │   ├── Cart.js
    │   ├── Order.js
    │   └── Review.js
    │
    ├── lib/
    │   ├── db.js                  ← MongoDB singleton connection
    │   ├── auth.js                ← signToken, verifyToken, authenticate, requireAdmin
    │   ├── apiClient.js           ← Axios instance + all API modules
    │   ├── apiResponse.js         ← apiSuccess / apiError / apiCreated helpers
    │   └── email.js               ← Nodemailer + email templates
    │
    ├── context/
    │   ├── AuthContextProvider.jsx
    │   ├── CartContextProvider.jsx
    │   └── WishlistProvider.jsx
    │
    └── components/
        ├── Navbar/
        ├── Footer/
        ├── ProductCard/
        ├── CartItem/
        ├── WishItem/
        ├── MainSlider/
        ├── CategoriesSlider/
        ├── ProtectedRoute/        ← Redirects to /login if not authenticated
        └── AdminRoute/            ← Redirects to / if not admin
```

---

## API Reference

All routes are under `/api`. Protected routes require `Authorization: Bearer <token>` (handled automatically by the Axios interceptor).

### Auth

| Method | Endpoint                      | Body                                           | Auth |
| ------ | ----------------------------- | ---------------------------------------------- | ---- |
| POST   | `/api/auth/register`          | `{ name, email, password, rePassword, phone }` | —    |
| POST   | `/api/auth/login`             | `{ email, password }`                          | —    |
| GET    | `/api/auth/verify-token`      | —                                              | ✅   |
| POST   | `/api/auth/forgot-password`   | `{ email }`                                    | —    |
| POST   | `/api/auth/verify-reset-code` | `{ resetCode }`                                | —    |
| PUT    | `/api/auth/reset-password`    | `{ email, newPassword }`                       | —    |

### Products

| Method | Endpoint            | Notes                                        |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/api/products`     | `?page=1&limit=40&keyword=&category=&brand=` |
| GET    | `/api/products/:id` | —                                            |
| POST   | `/api/products`     | 🔒 Admin                                     |
| PUT    | `/api/products/:id` | 🔒 Admin                                     |
| DELETE | `/api/products/:id` | 🔒 Admin                                     |

### Categories & Brands

```
GET    /api/categories
POST   /api/categories       🔒 Admin
PUT    /api/categories/:id   🔒 Admin
DELETE /api/categories/:id   🔒 Admin

GET    /api/brands
POST   /api/brands           🔒 Admin
PUT    /api/brands/:id       🔒 Admin
DELETE /api/brands/:id       🔒 Admin
```

### Cart

```
GET    /api/cart
POST   /api/cart                  { productId }
PUT    /api/cart/:productId       { count }
DELETE /api/cart/:productId       remove one item
DELETE /api/cart                  clear entire cart
```

### Wishlist

```
GET    /api/wishlist
POST   /api/wishlist              { productId }
DELETE /api/wishlist/:productId
```

### Orders

```
POST   /api/orders                { cartId, shippingAddress: { details, phone, city } }
GET    /api/orders                admin → all orders, customer → own orders
GET    /api/orders/user/:userId
GET    /api/orders/:id
PUT    /api/orders/:id            { status, isPaid, isDelivered }  🔒 Admin
```

### Users

```
GET    /api/users            🔒 Admin
GET    /api/users/:id        🔒 Admin
PUT    /api/users/:id        { role, active }  🔒 Admin
DELETE /api/users/:id        soft delete (sets active: false)  🔒 Admin
```

### Upload

```
POST   /api/upload           multipart/form-data, field: "file"
                             Returns: { url, public_id }
```

---

## Scripts

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Build for production
npm run start    # Serve the production build (run build first)
npm run lint     # Run ESLint
npm run seed     # Seed the database (⚠️ clears all existing data)
```

---

## Deployment (Vercel)

### 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/freshcart-nextjs.git
git branch -M main
git push -u origin main
```

Make sure `.env.local` is in your `.gitignore` — never push secrets.

### 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo
3. Before clicking Deploy, scroll to **Environment Variables** and add:

| Variable              | Value                                                         |
| --------------------- | ------------------------------------------------------------- |
| `MONGODB_URI`         | Your Atlas connection string with `/freshcart` before the `?` |
| `JWT_SECRET`          | Your secret string                                            |
| `JWT_EXPIRES_IN`      | `7d`                                                          |
| `NEXT_PUBLIC_API_URL` | `https://your-project.vercel.app` (your actual Vercel URL)    |
| + any optional vars   | Email / Cloudinary if needed                                  |

4. Click **Deploy**

### 3 — Whitelist Vercel on Atlas

Go to **Atlas → Security → Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`).

### 4 — Seed the production database

Run locally — it connects to the same Atlas database:

```bash
npm run seed
```

### 5 — Future deployments

Every `git push` to `main` triggers an automatic redeploy on Vercel.

---

## Troubleshooting

### 500 error on any API route

Check the **terminal** running `npm run dev` — the real error is printed there, not in the browser.

| Error                                                | Fix                                                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Please define MONGODB_URI in .env.local`            | Create `.env.local` from `.env.local.example` and fill in your Atlas URI                                                         |
| `MongoServerSelectionError: connection timed out`    | IP not whitelisted in Atlas → Security → Network Access → allow `0.0.0.0/0`                                                      |
| `bad auth: authentication failed`                    | Wrong password in `MONGODB_URI`                                                                                                  |
| `Schema hasn't been registered for model "Category"` | A route is missing a model import. Every route that calls `.populate()` must import all referenced models at the top of the file |

### Products show blank / don't load

```bash
rm -rf .next    # wipe stale build cache
npm run seed    # make sure database has data
npm run dev
```

### CORS error on Vercel

The URL in the API request contains `/login/api/...` instead of just `/api/...` — this means `NEXT_PUBLIC_API_URL` is not set in your Vercel environment variables. Go to **Vercel → Project → Settings → Environment Variables**, set it to your full production URL (e.g. `https://next-ecomm-project.vercel.app`), then redeploy.

### Login redirects back to /login immediately

The middleware reads the token from a browser cookie. Log out and log back in — the cookie gets set correctly on the next login.

---

## Environment Variables Reference

| Variable                | Required | Description                                                     |
| ----------------------- | :------: | --------------------------------------------------------------- |
| `MONGODB_URI`           |    ✅    | MongoDB Atlas connection string                                 |
| `JWT_SECRET`            |    ✅    | Secret key for signing tokens                                   |
| `JWT_EXPIRES_IN`        |    ✅    | Token lifetime — e.g. `7d`                                      |
| `NEXT_PUBLIC_API_URL`   |    ✅    | Full base URL — e.g. `http://localhost:3000` or your Vercel URL |
| `EMAIL_HOST`            |    ⚪    | SMTP host for password reset emails                             |
| `EMAIL_PORT`            |    ⚪    | SMTP port (usually `587`)                                       |
| `EMAIL_USER`            |    ⚪    | Gmail address                                                   |
| `EMAIL_PASS`            |    ⚪    | Gmail App Password (not your regular password)                  |
| `EMAIL_FROM`            |    ⚪    | Sender name and address                                         |
| `CLOUDINARY_CLOUD_NAME` |    ⚪    | For image uploads in admin panel                                |
| `CLOUDINARY_API_KEY`    |    ⚪    | Cloudinary API key                                              |
| `CLOUDINARY_API_SECRET` |    ⚪    | Cloudinary API secret                                           |

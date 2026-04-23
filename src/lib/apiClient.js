import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyToken: () => api.get("/auth/verify-token"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  verifyResetCode: (data) => api.post("/auth/verify-reset-code", data),
  resetPassword: (data) => api.put("/auth/reset-password", data),
};

// ─── Products ────────────────────────────────────────────
export const productsAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── Categories ──────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Brands ──────────────────────────────────────────────
export const brandsAPI = {
  getAll: (params) => api.get("/brands", { params }),
  getById: (id) => api.get(`/brands/${id}`),
  create: (data) => api.post("/brands", data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get("/cart"),
  add: (productId) => api.post("/cart", { productId }),
  update: (productId, count) => api.put(`/cart/${productId}`, { count }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete("/cart"),
};

// ─── Wishlist ─────────────────────────────────────────────
export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (productId) => api.post("/wishlist", { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// ─── Orders ──────────────────────────────────────────────
export const ordersAPI = {
  place: (cartId, shippingAddress) =>
    api.post("/orders", { cartId, shippingAddress }),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}`, data),
};

// ─── Users (admin) ────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  deactivate: (id) => api.delete(`/users/${id}`),
};

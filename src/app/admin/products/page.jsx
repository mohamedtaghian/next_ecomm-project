"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { productsAPI, categoriesAPI, brandsAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes } from "react-icons/fa";

const EMPTY = { title: "", description: "", price: "", priceAfterDiscount: "", quantity: "", imageCover: "", images: "", category: "", brand: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const load = (p = 1) => {
    setLoading(true);
    productsAPI.getAll({ page: p, keyword: search || undefined })
      .then(({ data }) => { setProducts(data.data.products || []); setPagination(data.data.metadata); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
    categoriesAPI.getAll().then(({ data }) => setCategories(data.data || []));
    brandsAPI.getAll().then(({ data }) => setBrands(data.data.brands || []));
  }, [page]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ title: p.title, description: p.description, price: p.price, priceAfterDiscount: p.priceAfterDiscount || "", quantity: p.quantity, imageCover: p.imageCover, images: (p.images || []).join(", "), category: p.category?._id || "", brand: p.brand?._id || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity), images: form.images ? form.images.split(",").map((s) => s.trim()) : [] };
    if (!form.priceAfterDiscount) delete payload.priceAfterDiscount;
    else payload.priceAfterDiscount = Number(form.priceAfterDiscount);

    const t = toast.loading(editing ? "Updating..." : "Creating...");
    try {
      if (editing) await productsAPI.update(editing, payload);
      else await productsAPI.create(payload);
      toast.success(editing ? "Product updated" : "Product created");
      setShowModal(false);
      load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { toast.dismiss(t); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const t = toast.loading("Deleting...");
    try { await productsAPI.delete(id); toast.success("Deleted"); load(page); }
    catch { toast.error("Failed to delete"); }
    finally { toast.dismiss(t); }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-dark-primary hover:text-primary"><FaArrowLeft /></Link>
          <h1 className="text-2xl font-extrabold text-dark-primary flex-1">Products</h1>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark-primary transition-colors">
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." onKeyDown={(e) => e.key === "Enter" && load(1)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" />
          <button onClick={() => load(1)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-dark-primary">Search</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageCover} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-dark-primary line-clamp-1 text-sm">{p.title}</h3>
                    <p className="text-primary font-semibold text-sm mt-1">EGP {p.price}</p>
                    <p className="text-gray-500 text-xs mt-1">Stock: {p.quantity} | {p.category?.name}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium transition-colors">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {[...Array(pagination?.numberOfPages || 0)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} disabled={i + 1 === page}
                  className="disabled:bg-primary/40 bg-primary text-white w-10 h-10 rounded-full hover:bg-dark-primary transition-colors">
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-dark-primary">{editing ? "Edit Product" : "New Product"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { name: "title", label: "Title", type: "text" },
                  { name: "price", label: "Price (EGP)", type: "number" },
                  { name: "priceAfterDiscount", label: "Price After Discount (optional)", type: "number" },
                  { name: "quantity", label: "Stock Quantity", type: "number" },
                  { name: "imageCover", label: "Cover Image URL", type: "url" },
                  { name: "images", label: "Extra Images (comma-separated URLs)", type: "text" },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
                    <input type={type} value={form[name]}
                      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      required={!["priceAfterDiscount", "images"].includes(name)} />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Brand (optional)</label>
                  <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    <option value="">No brand</option>
                    {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-dark-primary text-sm font-medium">
                    {editing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}

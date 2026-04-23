"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { categoriesAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes } from "react-icons/fa";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", image: "" });

  const load = () => {
    setLoading(true);
    categoriesAPI.getAll()
      .then(({ data }) => setItems(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", image: "" }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ name: item.name, image: item.image || "" }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading(editing ? "Updating..." : "Creating...");
    try {
      if (editing) await categoriesAPI.update(editing, form);
      else await categoriesAPI.create(form);
      toast.success(editing ? "Updated!" : "Created!");
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { toast.dismiss(t); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const t = toast.loading("Deleting...");
    try { await categoriesAPI.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
    finally { toast.dismiss(t); }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-dark-primary hover:text-primary"><FaArrowLeft /></Link>
          <h1 className="text-2xl font-extrabold text-dark-primary flex-1">Categories</h1>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark-primary transition-colors">
            <FaPlus /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || "https://via.placeholder.com/200"} alt={item.name} className="w-full h-28 object-cover" />
                <div className="p-3">
                  <p className="font-semibold text-dark-primary text-sm text-center line-clamp-1">{item.name}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => openEdit(item)} className="flex-1 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs transition-colors flex items-center justify-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs transition-colors flex items-center justify-center gap-1">
                      <FaTrash /> Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-dark-primary">{editing ? "Edit Category" : "New Category"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-dark-primary text-sm">{editing ? "Update" : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}

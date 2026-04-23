"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { brandsAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes } from "react-icons/fa";

export default function AdminBrandsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", image: "" });

  const load = () => {
    setLoading(true);
    brandsAPI.getAll()
      .then(({ data }) => setItems(data.data.brands || []))
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
      if (editing) await brandsAPI.update(editing, form);
      else await brandsAPI.create(form);
      toast.success(editing ? "Updated!" : "Created!");
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { toast.dismiss(t); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    const t = toast.loading("Deleting...");
    try { await brandsAPI.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
    finally { toast.dismiss(t); }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-dark-primary hover:text-primary"><FaArrowLeft /></Link>
          <h1 className="text-2xl font-extrabold text-dark-primary flex-1">Brands</h1>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark-primary transition-colors">
            <FaPlus /> Add Brand
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-full animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || "https://via.placeholder.com/120"} alt={item.name}
                  className="size-24 rounded-full object-contain bg-white shadow-md p-2 border" />
                <p className="text-xs font-semibold text-dark-primary text-center line-clamp-1">{item.name}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><FaEdit size={11} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><FaTrash size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-dark-primary">{editing ? "Edit Brand" : "New Brand"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Logo Image URL</label>
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

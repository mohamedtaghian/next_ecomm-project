"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { usersAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { FaArrowLeft, FaUserCheck, FaUserTimes, FaShieldAlt } from "react-icons/fa";

const ROLE_COLORS = { admin: "bg-purple-100 text-purple-700", seller: "bg-blue-100 text-blue-700", customer: "bg-green-100 text-green-700" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    usersAPI.getAll()
      .then(({ data }) => setUsers(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (user) => {
    const t = toast.loading(user.active ? "Deactivating..." : "Activating...");
    try {
      if (user.active) await usersAPI.deactivate(user._id);
      else await usersAPI.update(user._id, { active: true });
      toast.success(`User ${user.active ? "deactivated" : "activated"}`);
      load();
    } catch { toast.error("Failed"); }
    finally { toast.dismiss(t); }
  };

  const changeRole = async (user, role) => {
    const t = toast.loading("Updating role...");
    try {
      await usersAPI.update(user._id, { role });
      toast.success("Role updated");
      load();
    } catch { toast.error("Failed"); }
    finally { toast.dismiss(t); }
  };

  const filtered = users.filter(
    (u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-dark-primary hover:text-primary"><FaArrowLeft /></Link>
          <h1 className="text-2xl font-extrabold text-dark-primary flex-1">Users</h1>
          <span className="text-gray-500 text-sm">{users.length} total</span>
        </div>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="w-full md:w-96 mb-6 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-dark-primary">{user.name}</td>
                      <td className="px-4 py-3 text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 text-gray-500">{user.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button title={user.active ? "Deactivate" : "Activate"} onClick={() => toggleActive(user)}
                            className={`p-1.5 rounded-lg transition-colors ${user.active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {user.active ? <FaUserTimes size={12} /> : <FaUserCheck size={12} />}
                          </button>
                          {user.role !== "admin" && (
                            <button title="Make Admin" onClick={() => changeRole(user, "admin")}
                              className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                              <FaShieldAlt size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}

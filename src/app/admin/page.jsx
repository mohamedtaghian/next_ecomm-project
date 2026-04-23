"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { productsAPI, categoriesAPI, brandsAPI, usersAPI, ordersAPI } from "@/lib/apiClient";
import {
  FaBoxOpen, FaTags, FaTrademark, FaUsers, FaShoppingBag,
  FaChartBar, FaSignOutAlt,
} from "react-icons/fa";

function StatCard({ icon, label, value, href, color }) {
  return (
    <Link href={href}
      className={`flex items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 ${color}`}>
      <span className="text-3xl text-gray-500">{icon}</span>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-extrabold text-dark-primary">{value ?? "—"}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.allSettled([
      productsAPI.getAll({ limit: 1 }),
      categoriesAPI.getAll(),
      brandsAPI.getAll({ limit: 1 }),
      usersAPI.getAll(),
      ordersAPI.getAll(),
    ]).then(([p, c, b, u, o]) => {
      setStats({
        products: p.value?.data?.data?.metadata?.total ?? "—",
        categories: p.status === "fulfilled" ? (c.value?.data?.data?.length ?? "—") : "—",
        brands: b.value?.data?.data?.metadata?.total ?? "—",
        users: u.value?.data?.data?.length ?? "—",
        orders: o.value?.data?.data?.length ?? "—",
      });
    });
  }, []);

  const navLinks = [
    { href: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
    { href: "/admin/categories", label: "Categories", icon: <FaTags /> },
    { href: "/admin/brands", label: "Brands", icon: <FaTrademark /> },
    { href: "/admin/users", label: "Users", icon: <FaUsers /> },
    { href: "/admin/orders", label: "Orders", icon: <FaShoppingBag /> },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-primary text-white flex flex-col py-8 px-4 gap-2 fixed top-0 left-0 h-full z-50 shadow-xl">
          <div className="flex items-center gap-2 mb-8 px-2">
            <FaChartBar className="text-primary text-2xl" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-colors duration-200 text-sm font-medium">
                <span className="text-primary">{l.icon}</span>{l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-sm font-medium text-red-300 hover:text-red-200 transition-colors">
            <FaSignOutAlt /> Back to Store
          </Link>
        </aside>

        {/* Main */}
        <main className="ml-64 flex-1 p-10">
          <h1 className="text-3xl font-extrabold text-dark-primary mb-2">Dashboard</h1>
          <p className="text-gray-500 mb-8">Welcome back, Admin</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard icon={<FaBoxOpen />} label="Total Products" value={stats.products} href="/admin/products" color="border-primary" />
            <StatCard icon={<FaTags />} label="Categories" value={stats.categories} href="/admin/categories" color="border-blue-500" />
            <StatCard icon={<FaTrademark />} label="Brands" value={stats.brands} href="/admin/brands" color="border-orange-500" />
            <StatCard icon={<FaUsers />} label="Users" value={stats.users} href="/admin/users" color="border-purple-500" />
            <StatCard icon={<FaShoppingBag />} label="Orders" value={stats.orders} href="/admin/orders" color="border-yellow-500" />
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute/AdminRoute";
import { ordersAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    ordersAPI.getAll()
      .then(({ data }) => setOrders(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    const t = toast.loading("Updating...");
    try {
      await ordersAPI.updateStatus(orderId, {
        status,
        isDelivered: status === "delivered",
        isPaid: status === "delivered" || status === "shipped",
      });
      toast.success("Order updated");
      load();
    } catch { toast.error("Failed"); }
    finally { toast.dismiss(t); }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-dark-primary hover:text-primary"><FaArrowLeft /></Link>
          <h1 className="text-2xl font-extrabold text-dark-primary flex-1">Orders</h1>
          <span className="text-gray-500 text-sm">{orders.length} total</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No orders yet</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark-primary text-sm truncate">#{order._id}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{order.user?.name} · {order.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">EGP {order.totalOrderPrice}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.paymentMethodType === "card" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{order.paymentMethodType}</span>
                    <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${expanded === order._id ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === order._id && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Shipping Address</p>
                        <p className="text-sm text-dark-primary">{order.shippingAddress?.details}</p>
                        <p className="text-sm text-gray-500">{order.shippingAddress?.city} · {order.shippingAddress?.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Totals</p>
                        <p className="text-sm text-gray-500">Shipping: EGP {order.shippingPrice}</p>
                        <p className="text-sm text-gray-500">Tax: EGP {order.taxPrice}</p>
                        <p className="text-sm font-bold text-dark-primary">Total: EGP {order.totalOrderPrice}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items ({order.cartItems?.length})</p>
                      <div className="space-y-2">
                        {order.cartItems?.map((item) => (
                          <div key={item._id} className="flex items-center gap-3 bg-white p-3 rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.product?.imageCover} alt={item.product?.title} className="w-10 h-10 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark-primary truncate">{item.product?.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.count} × EGP {item.price}</p>
                            </div>
                            <p className="text-sm font-semibold text-primary">EGP {item.count * item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <button key={s} onClick={() => updateStatus(order._id, s)} disabled={order.status === s}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                              order.status === s ? "opacity-50 cursor-not-allowed " + (STATUS_COLORS[s] || "") : "bg-gray-100 text-gray-600 hover:bg-primary hover:text-white"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminRoute>
  );
}

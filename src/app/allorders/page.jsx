"use client";
import { useEffect, useState } from "react";
import { ordersAPI } from "@/lib/apiClient";
import GoBack from "@/components/GoBack/GoBack";
import OrderDetails from "@/components/OrderDetails/OrderDetails";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { LiaShippingFastSolid } from "react-icons/lia";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setIsLoading(true);
    ordersAPI.getByUser(userId)
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <section>
        <div className="container flex flex-col gap-8">
          <header className="flex items-center gap-6">
            <GoBack />
            <h2 className="text-2xl text-dark-primary font-bold">Track Your Orders</h2>
            <LiaShippingFastSolid className="size-8 text-primary" />
          </header>
          {isLoading ? <CartPreloader /> : error ? <NoDataFound /> : !orders.length ? (
            <div className="flex flex-col justify-center items-center gap-8 min-h-52">
              <h3 className="text-dark-primary font-semibold text-xl">No orders yet.</h3>
              <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-sm hover:bg-dark-primary duration-300">Add Your First Order</Link>
            </div>
          ) : (
            orders.map((order) => order.cartItems?.length ? <OrderDetails key={order._id} order={order} /> : null)
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}

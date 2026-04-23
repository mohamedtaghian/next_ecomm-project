"use client";
import { useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import GoBack from "@/components/GoBack/GoBack";
import Link from "next/link";
import WishItem from "@/components/WishItem/WishItem";
import { wishContext } from "@/context/WishlistProvider";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function WishListPage() {
  const { getLoggedUserWish, wish, isLoading } = useContext(wishContext);

  useEffect(() => { getLoggedUserWish(); }, []);

  // wish is now: { count, data: [...products] }
  const items = wish?.data || [];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <section>
          <div className="container animate-pulse">
            <div className="bg-gray-200 p-5 rounded-3xl">
              <div className="h-10 w-48 bg-gray-400 rounded mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-300 rounded" />)}
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section>
        <div className="container">
          <div className="bg-main-light p-5 rounded-3xl">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 my-4 pb-8 border-b-2 border-primary">
              <div className="flex items-center gap-2">
                <GoBack />
                <h2 className="text-xl md:text-2xl font-bold text-dark-primary flex items-center gap-2">
                  Favourite Products
                  <span className="text-white bg-primary p-2 rounded-full"><FaHeart /></span>
                </h2>
              </div>
              {items.length > 0 && (
                <span className="text-primary font-semibold">{items.length} item{items.length > 1 ? "s" : ""}</span>
              )}
            </header>
            {items.length > 0 ? (
              <div className="products max-h-screen overflow-x-auto">
                {items.map((item) => <WishItem key={item._id} item={item} />)}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 py-6">
                <p className="text-dark-primary text-2xl font-bold">No favourites yet.</p>
                <Link className="py-2 px-6 text-white bg-primary rounded-sm hover:bg-dark-primary duration-300" href="/products">
                  Discover Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

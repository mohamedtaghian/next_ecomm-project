"use client";
import { useContext, useEffect } from "react";
import { FaOpencart, FaTrashAlt } from "react-icons/fa";
import { cartContext } from "@/context/CartContextProvider";
import CartItem from "@/components/CartItem/CartItem";
import Link from "next/link";
import GoBack from "@/components/GoBack/GoBack";
import CheckOut from "@/components/CheckOut/CheckOut";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function CartPage() {
  const { cartProducts, getLoggedUserCart, clearCart, isLoading } = useContext(cartContext);

  useEffect(() => { getLoggedUserCart(); }, []);

  const products = cartProducts?.data?.products || [];
  const totalPrice = cartProducts?.data?.totalCartPrice;
  const cartId = cartProducts?.cartId;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <section>
          <div className="container bg-main-light p-5 rounded-3xl animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-4 pb-8 border-b-2 border-primary">
              <div className="flex items-center gap-6">
                <div className="h-10 w-10 bg-white rounded-full" />
                <div className="h-6 w-24 bg-white rounded" />
              </div>
              <div className="h-4 w-24 bg-white rounded" />
            </div>
            <div className="h-64 bg-white mt-4 rounded" />
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
              <div className="flex items-center gap-6">
                <GoBack />
                <h2 className="text-2xl font-bold text-dark-primary flex items-center gap-2">
                  Shop Cart <span className="text-primary"><FaOpencart /></span>
                </h2>
              </div>
              {products.length > 0 && (
                <div className="flex flex-col justify-center items-center gap-3">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="text-dark-primary">Total Price:</span>
                    <span className="text-primary">EGP {totalPrice}</span>
                  </p>
                  <a href="#checkOut" className="py-2 px-6 bg-white hover:bg-primary text-primary hover:text-white text-sm rounded-sm border border-dark-primary hover:border-primary cursor-pointer transition-all duration-300">
                    Check Out
                  </a>
                </div>
              )}
            </header>

            {products.length > 0 ? (
              <>
                <div className="products max-h-screen overflow-x-auto">
                  {products.map((item) => <CartItem key={item._id} item={item} />)}
                </div>
                <button onClick={clearCart} className="group py-1 px-3 bg-red-600 text-white flex items-center gap-2 rounded-sm cursor-pointer hover:bg-red-600/80 my-5 mx-auto">
                  <FaTrashAlt className="group-hover:animate-wiggle" />
                  <span>Clear Cart</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 py-10">
                <p className="text-dark-primary text-2xl font-bold">Your cart is empty.</p>
                <Link className="py-2 px-6 text-white bg-primary rounded-sm hover:bg-dark-primary duration-300" href="/products">
                  Add Your First Product
                </Link>
              </div>
            )}

            {products.length > 0 && (
              <span id="checkOut">
                <CheckOut totalPrice={totalPrice} cartId={cartId} />
              </span>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

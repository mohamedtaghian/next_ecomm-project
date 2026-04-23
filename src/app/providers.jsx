"use client";
import AuthContextProvider from "@/context/AuthContextProvider";
import CartContextProvider from "@/context/CartContextProvider";
import WishlistProvider from "@/context/WishlistProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <WishlistProvider>
          {children}
          <Toaster
            toastOptions={{
              success: { style: { color: "green" } },
              error: { style: { color: "red" } },
            }}
          />
        </WishlistProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

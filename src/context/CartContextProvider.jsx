"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authContext } from "./AuthContextProvider";
import { cartAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";

export const cartContext = createContext(null);

export default function CartContextProvider({ children }) {
  const { token } = useContext(authContext);
  const [cartProducts, setCartProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const getLoggedUserCart = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCartProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToCart = async (productId) => {
    const t = toast.loading("Adding to cart...");
    try {
      const { data } = await cartAPI.add(productId);
      toast.success(data.message || "Added to cart");
      setCartProducts(data.data);
    } catch (err) {
      toast.error("Could not add product");
    } finally {
      toast.dismiss(t);
    }
  };

  const removeCartItem = async (productId) => {
    const t = toast.loading("Removing...");
    try {
      const { data } = await cartAPI.remove(productId);
      toast.success("Product removed");
      setCartProducts(data.data);
    } catch (err) {
      toast.error("Could not remove product");
    } finally {
      toast.dismiss(t);
    }
  };

  const clearCart = async () => {
    const t = toast.loading("Clearing cart...");
    try {
      await cartAPI.clear();
      toast.success("Cart cleared");
      setCartProducts(null);
    } catch (err) {
      toast.error("Could not clear cart");
    } finally {
      toast.dismiss(t);
    }
  };

  const updateCartItem = async (productId, count) => {
    const t = toast.loading("Updating...");
    setIsDisabled(true);
    try {
      const { data } = await cartAPI.update(productId, count);
      toast.success(`Quantity updated to ${count}`);
      setCartProducts(data.data);
    } catch (err) {
      toast.error("Could not update quantity");
    } finally {
      toast.dismiss(t);
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    if (token) getLoggedUserCart();
    else setCartProducts(null);
  }, [token]);

  return (
    <cartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProductToCart,
        updateCartItem,
        getLoggedUserCart,
        removeCartItem,
        clearCart,
        isLoading,
        isDisabled,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}

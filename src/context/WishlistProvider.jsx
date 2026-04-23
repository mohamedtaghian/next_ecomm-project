"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authContext } from "./AuthContextProvider";
import { wishlistAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";

export const wishContext = createContext(null);

export default function WishlistProvider({ children }) {
  const { token } = useContext(authContext);
  const [wish, setWish] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLoggedUserWish = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await wishlistAPI.get();
      setWish(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToWish = async (productId) => {
    const t = toast.loading("Adding to wishlist...");
    try {
      const { data } = await wishlistAPI.add(productId);
      toast.success(data.message || "Added to wishlist");
      getLoggedUserWish();
    } catch (err) {
      toast.error("Could not add to wishlist");
    } finally {
      toast.dismiss(t);
    }
  };

  const removeWishItem = async (productId) => {
    const t = toast.loading("Removing...");
    try {
      await wishlistAPI.remove(productId);
      toast.success("Removed from wishlist");
      getLoggedUserWish();
    } catch (err) {
      toast.error("Could not remove from wishlist");
    } finally {
      toast.dismiss(t);
    }
  };

  useEffect(() => {
    if (token) getLoggedUserWish();
    else setWish(null);
  }, [token]);

  return (
    <wishContext.Provider
      value={{ getLoggedUserWish, addProductToWish, removeWishItem, wish, setWish, isLoading }}
    >
      {children}
    </wishContext.Provider>
  );
}

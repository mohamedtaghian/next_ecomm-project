"use client";
import React, { createContext, useState, useEffect } from "react";

export const authContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      // Keep cookie in sync with localStorage on page load
      document.cookie = `token=${storedToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
    }
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (_) {}
    }
  }, []);

  const updateToken = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser || null);
    if (newToken) {
      localStorage.setItem("token", newToken);
      if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
      // Also write to cookie so Next.js middleware can read it for SSR redirects
      document.cookie = `token=${newToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      // Clear cookie on logout
      document.cookie = "token=; path=/; max-age=0";
    }
  };

  return (
    <authContext.Provider value={{ token, setToken: updateToken, user, setUser }}>
      {children}
    </authContext.Provider>
  );
}

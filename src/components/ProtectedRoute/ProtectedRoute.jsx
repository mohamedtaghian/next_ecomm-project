"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "@/context/AuthContextProvider";
import { authAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { token, setToken } = useContext(authContext);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const verifyToken = async function (currentToken) {
    try {
      // ✅ Call YOUR local API, not the old Route Academy external URL
      const { data } = await authAPI.verifyToken();
      localStorage.setItem("userId", data.data.decoded.id);
    } catch (error) {
      console.error(error);
      toast.error("Session expired. Please log in again.");
      setToken(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      verifyToken(storedToken).finally(() => setReady(true));
    }
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoute({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { router.push("/login"); return; }
    try {
      const parsed = JSON.parse(user);
      if (parsed.role !== "admin") { router.push("/"); return; }
      setReady(true);
    } catch { router.push("/login"); }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

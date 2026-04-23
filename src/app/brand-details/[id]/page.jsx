"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productsAPI } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard/ProductCard";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import GoBack from "@/components/GoBack/GoBack";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function BrandDetailsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productsAPI.getAll({ brand: id })
      .then(({ data }) => setProducts(data.data.products || []))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <ProtectedRoute>
      {isLoading ? <CartPreloader /> : (error || !products.length) ? (
        <><GoBack /><NoDataFound /></>
      ) : (
        <section>
          <div className="container">
            <span className="block mb-4"><GoBack /></span>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}

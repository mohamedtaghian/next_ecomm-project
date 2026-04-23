"use client";
import { useEffect, useState } from "react";
import { productsAPI } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard/ProductCard";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState(null);

  const load = (page = 1) => {
    setIsLoading(true);
    productsAPI.getAll({ page })
      .then(({ data }) => { setProducts(data.data.products || []); setPagination(data.data.metadata); })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <ProtectedRoute>
      {isLoading ? <CartPreloader /> : error ? <NoDataFound /> : (
        <section>
          <div className="container">
            <SectionHeading>All Products</SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="flex justify-center items-center gap-4 my-10">
              {[...Array(pagination?.numberOfPages || 0)].map((_, i) => (
                <button key={i} disabled={i + 1 === pagination?.currentPage}
                  onClick={() => load(i + 1)}
                  className="disabled:bg-primary/50 bg-primary text-white px-6 py-2 rounded-md cursor-pointer hover:bg-dark-primary duration-300">
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}

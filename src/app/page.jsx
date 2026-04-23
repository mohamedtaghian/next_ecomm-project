"use client";
import { useEffect, useState } from "react";
import { productsAPI } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard/ProductCard";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import MainSlider from "@/components/MainSlider/MainSlider";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CategoriesSlider from "@/components/CategoriesSlider/CategoriesSlider";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    productsAPI.getAll({ limit: 40 })
      .then(({ data }) => setProducts(data.data.products || []))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      {isLoading ? <CartPreloader /> : error ? <NoDataFound /> : (
        <>
          <MainSlider />
          <CategoriesSlider />
          <section>
            <div className="container">
              <SectionHeading>Shop now by popular products</SectionHeading>
              <div id="section-products" className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </section>
        </>
      )}
    </ProtectedRoute>
  );
}

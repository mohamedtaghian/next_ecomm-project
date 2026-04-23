"use client";
import { useEffect, useState } from "react";
import { categoriesAPI } from "@/lib/apiClient";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    categoriesAPI.getAll()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      {isLoading ? <CartPreloader /> : error ? <NoDataFound /> : (
        <section>
          <div className="container">
            <SectionHeading>Shop By Category</SectionHeading>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {categories.map((c) => <CategoryCard key={c._id} category={c} />)}
            </div>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}

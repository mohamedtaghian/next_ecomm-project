"use client";
import { useEffect, useState } from "react";
import { brandsAPI } from "@/lib/apiClient";
import BrandCard from "@/components/BrandCard/BrandCard";
import CartPreloader from "@/components/CartPreloader/CartPreloader";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState(null);

  const load = (page = 1) => {
    setIsLoading(true);
    brandsAPI.getAll({ page })
      .then(({ data }) => { setBrands(data.data.brands || []); setPagination(data.data.metadata); })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <ProtectedRoute>
      {isLoading ? <CartPreloader /> : error ? <NoDataFound /> : (
        <section>
          <div className="container">
            <SectionHeading>Shop By Brand</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {brands.map((b) => <BrandCard key={b._id} brand={b} />)}
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

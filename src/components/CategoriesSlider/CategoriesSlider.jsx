"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function CategoriesSlider() {
  const [categories, setCategories] = useState(null);

  const getAllCategories = async function () {
    try {
      // ✅ Use local API, not the old Route Academy external URL
      const { data } = await axios.get("/api/categories");
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <section>
      <div className="container">
        <h2 className="font-semibold text-lg text-dark-primary my-3">
          Shop now by popular categories
        </h2>
        <Swiper
          slidesPerView={2}
          breakpoints={{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          spaceBetween={0}
          modules={[Pagination]}
        >
          {categories?.map((category) => (
            <SwiperSlide key={category._id}>
              <CategoryCard isSlider={true} category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

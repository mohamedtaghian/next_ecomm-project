"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productsAPI } from "@/lib/apiClient";
import { cartContext } from "@/context/CartContextProvider";
import { wishContext } from "@/context/WishlistProvider";
import ProductCard from "@/components/ProductCard/ProductCard";
import GoBack from "@/components/GoBack/GoBack";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { FaRegHeart, FaCartPlus, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addProductToCart } = useContext(cartContext);
  const { addProductToWish } = useContext(wishContext);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productsAPI.getById(id)
      .then(({ data }) => {
        const p = data.data;
        setProduct(p);
        if (p?.category?._id) {
          productsAPI.getAll({ "category[in]": p.category._id })
            .then(({ data: r }) => setRelated(r.data.products || []));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return (
    <ProtectedRoute>
      <section><div className="container animate-pulse">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:basis-1/3 h-80 bg-gray-200 rounded" />
          <div className="flex-1 space-y-4 p-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div></section>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <>
        <section>
          <div className="container flex flex-col md:flex-row gap-10">
            <div className="image md:basis-1/3 overflow-hidden">
              <Swiper spaceBetween={5} thumbs={{ swiper: thumbsSwiper }} allowTouchMove={false}
                freeMode autoplay modules={[FreeMode, Thumbs, Autoplay]} className="mySwiper2">
                {product?.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="max-h-96 mx-auto w-full object-contain" src={img} alt={product?.title} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper onSwiper={setThumbsSwiper} spaceBetween={1} slidesPerView={4} freeMode
                autoplay watchSlidesProgress modules={[FreeMode, Navigation, Thumbs, Autoplay]} className="mySwiper">
                {product?.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="cursor-pointer border-4 border-transparent hover:border-sky-700 transition-all duration-300" src={img} alt={product?.title} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="data flex-1 p-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center gap-2.5">
                  <h2 className="text-3xl font-bold text-dark-primary line-clamp-1">{product?.title}</h2>
                  <GoBack />
                </div>
                <h3 className="text-sm text-primary font-semibold">{product?.category?.name}</h3>
                <div className="text-sm text-gray-500">
                  <span>{product?.brand?.name}</span><span className="mx-1">|</span>
                  {product?.quantity > 0 ? <span className="text-green-500">Available</span> : <span className="text-red-500">Sold Out</span>}
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-dark-primary">{product?.ratingsAverage}</span>
                </div>
              </div>
              <p className="text-slate-500 my-4">{product?.description}</p>
              {product?.priceAfterDiscount ? (
                <>
                  <span className="inline-block me-2.5 text-slate-400 text-sm line-through">EGP {product?.price}</span>
                  <span className="inline-block text-lg text-primary font-semibold mb-4">EGP {product?.priceAfterDiscount}</span>
                </>
              ) : (
                <span className="inline-block text-lg text-primary font-semibold mb-4">EGP {product?.price}</span>
              )}
              <div className="text-white flex items-center gap-4">
                <button onClick={() => addProductToWish(id)} className="bg-primary hover:bg-dark-primary cursor-pointer py-2 px-6 rounded-sm self-stretch transition-all duration-300">
                  <FaRegHeart />
                </button>
                <button onClick={() => addProductToCart(id)} className="group bg-primary hover:bg-dark-primary cursor-pointer flex-1 flex justify-center items-center gap-1.5 py-2 rounded-sm transition-all duration-300">
                  <FaCartPlus className="group-hover:animate-wiggle" /><span className="uppercase">Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20">
          <div className="container border-t-4 border-primary">
            <h3 className="text-4xl font-extrabold text-dark-primary my-5">Related Products</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      </>
    </ProtectedRoute>
  );
}

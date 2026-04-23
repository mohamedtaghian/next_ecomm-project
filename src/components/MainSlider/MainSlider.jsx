"use client";
import Link from "next/link";
import { FaOpencart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function MainSlider() {
  return (
    <section>
      <div className="container flex flex-col md:flex-row">
        <div className="md:basis-[70%] overflow-hidden">
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            className="h-[400px] md:h-full cursor-pointer"
          >
            <SwiperSlide
              className="bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1487744480471-9ca1bca6fb7d?q=80&w=2691&auto=format&fit=crop')",
              }}
            >
              <div className="p-5 flex flex-col gap-5">
                <h2 className="text-base md:text-3xl font-bold flex items-center gap-2 bg-white w-fit py-2 px-3 rounded-full">
                  <span className="text-primary"><FaOpencart /></span>
                  <span className="text-dark-primary">FreshCart</span>
                </h2>
                <p className="text-sm/6 text-white font-semibold bg-white/10 p-5 rounded-lg max-w-sm">
                  Whether you&apos;re looking for the freshest produce, pantry staples, or specialty
                  items, FreshCart brings the supermarket to you, redefining the way you shop for
                  groceries.
                </p>
                <Link
                  href="#section-products"
                  className="self-start text-white bg-primary py-2 px-6 rounded-full hover:bg-dark-primary duration-300"
                >
                  Get Started
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide
              className="bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://eco-iota-amber.vercel.app/assets/product2-Cc8hawmZ.jpg')",
              }}
            />
            <SwiperSlide
              className="bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://eco-iota-amber.vercel.app/assets/product3-CjkhanyU.jpg')",
              }}
            />
          </Swiper>
        </div>
        <div className="md:basis-[30%] flex flex-row md:flex-col overflow-hidden">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full"
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
              alt="Cosmetics products"
            />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full"
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
              alt="Black friday offers"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { FaRegHeart, FaCartPlus, FaEye, FaStar } from "react-icons/fa";
import { useContext } from "react";
import { cartContext } from "@/context/CartContextProvider";
import { wishContext } from "@/context/WishlistProvider";

export default function ProductCard({ product }) {
  const { addProductToCart } = useContext(cartContext);
  const { addProductToWish } = useContext(wishContext);

  return (
    <article className="productCard group relative flex flex-col gap-3 shadow-md rounded-md overflow-hidden">
      <header className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" src={product.imageCover} alt={product.title} />
        <div className="layer flex justify-center items-center gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            onClick={() => addProductToWish(product._id)}
            className="icon opacity-0 translate-y-20 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-dark-primary duration-300 cursor-pointer bg-primary flex justify-center items-center size-12 rounded-full text-white"
          >
            <FaRegHeart className="size-6" />
          </span>
          <span
            onClick={() => addProductToCart(product._id)}
            className="icon opacity-0 translate-y-20 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-dark-primary duration-700 cursor-pointer bg-primary flex justify-center items-center size-12 rounded-full text-white"
          >
            <FaCartPlus className="size-6" />
          </span>
          <Link
            href={`/product-details/${product._id}`}
            className="icon opacity-0 translate-y-20 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-dark-primary duration-1000 cursor-pointer bg-primary flex justify-center items-center size-12 rounded-full text-white"
          >
            <FaEye className="size-6" />
          </Link>
        </div>
      </header>
      <footer className="py-6 px-5">
        <header>
          <h2 className="line-clamp-1 text-primary">
            <Link className="hover:text-orange-500 duration-300" href={`/product-details/${product._id}`}>
              {product.title}
            </Link>
          </h2>
          <h2 className="line-clamp-1 font-semibold my-1 text-dark-primary">
            {product.category.name}
          </h2>
          <div className="text-gray-500 text-sm">
            <span>{product.brand.name}</span>
            <span className="mx-1">|</span>
            {product.quantity > 0 ? (
              <span className="text-primary">Available</span>
            ) : (
              <span className="text-red-500">Sold Out</span>
            )}
          </div>
        </header>
        <footer className="flex justify-between mt-2 items-center">
          <span className="text-primary flex items-center">EGP {product.price}</span>
          <div className="rating flex gap-2 items-center">
            <span><FaStar className="text-yellow-400" /></span>
            <span className="text-dark-primary">{product.ratingsAverage}</span>
          </div>
        </footer>
      </footer>
      {product.priceAfterDiscount ? (
        <span className="size-1 p-7 flex flex-col justify-center items-center bg-dark-primary rounded-full rounded-tl-none text-sm absolute top-0 left-0">
          <span className="text-orange-400">
            <span className="me-0.5">-</span>
            {(((product.price - product.priceAfterDiscount) / product.price) * 100).toFixed(0)}%
          </span>
          <span className="text-primary font-bold">Sale</span>
        </span>
      ) : null}
    </article>
  );
}

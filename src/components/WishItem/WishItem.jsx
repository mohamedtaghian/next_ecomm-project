"use client";
import { useContext } from "react";
import { FaCartPlus, FaStar, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { wishContext } from "@/context/WishlistProvider";
import { cartContext } from "@/context/CartContextProvider";

export default function WishItem({ item }) {
  const { removeWishItem } = useContext(wishContext);
  const { addProductToCart } = useContext(cartContext);

  return (
    <article className="mt-4 border-b border-gray-300 pb-8 flex items-center gap-5">
      <div className="self-start border border-gray-300 rounded-3xl basis-1/6 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" src={item?.imageCover} alt={item?.title} />
      </div>
      <div className="product-data flex-1 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="product-details flex flex-col gap-1">
          <Link
            className="font-bold text-xl max-lg:line-clamp-1 text-dark-primary hover:text-primary duration-300"
            href={`/product-details/${item?._id}`}
          >
            {item?.title}
          </Link>
          <p className="flex items-center gap-2">
            <span className="text-dark-primary">Rate :</span>
            <span className="text-primary flex items-center gap-0.5">
              <FaStar className="text-yellow-400" />
              {item?.ratingsAverage}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-dark-primary">Price :</span>
            <span className="text-primary">EGP {item?.price}</span>
          </p>
          <p className="text-sm text-gray-500">
            <span>{item?.category?.name}</span>
            <span className="mx-1">|</span>
            <span>{item?.brand?.name}</span>
            <span className="mx-1">|</span>
            {item?.quantity > 0 ? (
              <span className="text-primary">Available</span>
            ) : (
              <span className="text-red-500">Sold Out</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            className="group flex items-center gap-2.5 py-2 px-6 bg-primary text-sm text-white rounded-full cursor-pointer hover:bg-dark-primary duration-300"
            onClick={() => addProductToCart(item?._id)}
          >
            <FaCartPlus className="group-hover:animate-wiggle" />
            <span className="uppercase">Add To Cart</span>
          </button>
          <button
            className="group flex items-center gap-2.5 py-2 px-6 bg-red-500 text-sm text-white rounded-full cursor-pointer hover:bg-red-700 duration-300"
            onClick={() => removeWishItem(item?._id)}
          >
            <FaTrashAlt className="group-hover:animate-wiggle" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
}

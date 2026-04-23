"use client";
import { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { cartContext } from "@/context/CartContextProvider";

export default function CartItem({ item }) {
  const { removeCartItem, updateCartItem, isDisabled } = useContext(cartContext);
  const [count, setCount] = useState(item?.count);

  const updateCartItemCount = function () {
    if (count === item?.count) return;
    updateCartItem(item?.product._id, count);
  };

  return (
    <article className="mt-4 border-b border-gray-300 pb-8 flex items-center gap-5">
      <div className="self-start border border-gray-300 rounded-3xl basis-1/6 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" src={item?.product.imageCover} alt={item?.product.title} />
      </div>
      <div className="product-data flex-1 flex flex-col md:flex-row items-center">
        <div className="basis-1/2 product-details flex flex-col gap-1">
          <Link
            className="font-bold text-xl max-lg:line-clamp-1 text-dark-primary hover:text-primary duration-300"
            href={`/product-details/${item?.product._id}`}
          >
            {item?.product.title}
          </Link>
          <p className="flex items-center gap-2">
            <span className="text-dark-primary">Rate :</span>
            <span className="text-primary flex items-center gap-0.5">
              <FaStar className="text-yellow-400" />
              {item?.product.ratingsAverage}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-dark-primary">Price :</span>
            <span className="text-primary">EGP {item?.price}</span>
          </p>
          <p className="text-sm text-gray-500">
            <span>{item?.product.category?.name}</span>
            <span className="mx-1">|</span>
            <span>{item?.product.brand?.name}</span>
            <span className="mx-1">|</span>
            {item?.product.quantity > 0 ? (
              <span className="text-primary">Available</span>
            ) : (
              <span className="text-red-500">Sold Out</span>
            )}
          </p>
        </div>
        <div className="basis-1/2 flex flex-col md:flex-row md:justify-between items-center gap-1.5 mt-5 md:mt-0">
          <div className="py-2 px-4 border-2 rounded-2xl w-fit border-gray-300 text-dark-primary font-bold flex items-center gap-5">
            <button
              disabled={isDisabled}
              onClick={() => {
                setCount(count - 1);
                updateCartItem(item?.product._id, count - 1);
              }}
              className="disabled:cursor-not-allowed cursor-pointer hover:text-primary text-xl duration-300"
            >
              &#8722;
            </button>
            <input
              className="text-center w-20 bg-primary/20 focus:outline-0"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              onBlur={updateCartItemCount}
            />
            <button
              disabled={isDisabled}
              onClick={() => {
                setCount(count + 1);
                updateCartItem(item?.product._id, count + 1);
              }}
              className="disabled:cursor-not-allowed cursor-pointer hover:text-primary text-xl duration-300"
            >
              &#43;
            </button>
          </div>
          <div className="text-xs flex flex-col justify-center items-center">
            <span className="text-dark-primary text-center">Total Price</span>
            <span className="text-primary">EGP {item?.count * item?.price}</span>
          </div>
          <button
            onClick={() => removeCartItem(item.product._id)}
            className="group border-2 border-transparent hover:border-red-600 rounded-full p-1 cursor-pointer duration-300"
          >
            <IoClose className="group-hover:text-red-600 group-hover:rotate-90 text-lg text-gray-500 duration-300" />
          </button>
        </div>
      </div>
    </article>
  );
}

"use client";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcMoneyTransfer, FcOnlineSupport } from "react-icons/fc";
import { cartContext } from "@/context/CartContextProvider";
import { ordersAPI } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckOut({ totalPrice, cartId }) {
  const { setCartProducts } = useContext(cartContext);
  const [pay, setPay] = useState("cash");
  const router = useRouter();
  const phoneRegex = /^01[0125][0-9]{8}$/;

  const inputCls = "text-sm py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary";
  const errCls = "text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm";

  const formik = useFormik({
    initialValues: { details: "", phone: "", city: "" },
    validationSchema: Yup.object({
      details: Yup.string().required("Details required").min(3).max(50),
      phone: Yup.string().required("Phone required").matches(phoneRegex, "Invalid Egyptian phone number"),
      city: Yup.string().required("City required").min(3).max(25),
    }),
    onSubmit: async (values) => {
      if (!cartId) { toast.error("Cart not found. Please refresh."); return; }
      const t = toast.loading("Placing your order...");
      try {
        if (pay === "cash") {
          const { data } = await ordersAPI.place(cartId, values);
          if (data.data) {
            toast.success("Order placed successfully!");
            setCartProducts(null);
            router.push("/allorders");
          }
        } else {
          toast.error("Online payment coming soon!");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Order failed. Try again.");
      } finally {
        toast.dismiss(t);
      }
    },
  });

  return (
    <>
      <h2 className="text-center my-8 pt-2.5 font-bold text-lg text-dark-primary border-t-2">Check Out</h2>
      <form onSubmit={formik.handleSubmit} className="p-8 border border-gray-300 rounded-lg max-w-sm mx-auto flex flex-col gap-5">
        <h3 className="font-bold">
          <span className="text-dark-primary">Total Price: </span>
          <span className="text-primary">EGP {totalPrice}</span>
        </h3>
        <div>
          <input className={inputCls} type="text" name="city" placeholder="Enter Your City Name"
            value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.city && formik.touched.city && <p className={errCls}>{formik.errors.city}</p>}
        </div>
        <div>
          <input className={inputCls} type="tel" name="phone" placeholder="Enter Your Phone"
            value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.phone && formik.touched.phone && <p className={errCls}>{formik.errors.phone}</p>}
        </div>
        <div>
          <textarea className={`${inputCls} resize-none h-28`} name="details" placeholder="Address Details"
            value={formik.values.details} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.details && formik.touched.details && <p className={errCls}>{formik.errors.details}</p>}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button onClick={() => setPay("cash")} type="submit"
            className={`flex-1 self-stretch flex justify-center items-center gap-2 py-2 px-6 rounded-sm text-white cursor-pointer transition-all duration-300 ${pay === "cash" ? "bg-dark-primary" : "bg-primary hover:bg-dark-primary"}`}>
            <FcMoneyTransfer className="size-8" /><span>Cash Order</span>
          </button>
          <button onClick={() => setPay("online")} type="submit"
            className={`flex-1 self-stretch flex justify-center items-center gap-2 py-2 px-6 rounded-sm cursor-pointer transition-all duration-300 ${pay === "online" ? "bg-dark-primary text-white" : "text-dark-primary bg-white shadow-lg hover:bg-dark-primary hover:text-white"}`}>
            <FcOnlineSupport className="size-8" /><span>Online Order</span>
          </button>
        </div>
      </form>
    </>
  );
}

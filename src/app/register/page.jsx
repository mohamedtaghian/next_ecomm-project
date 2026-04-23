"use client";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { authAPI } from "@/lib/apiClient";
import LoginProtectedRoute from "@/components/LoginProtectedRoute/LoginProtectedRoute";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState("password");
  const router = useRouter();
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const toggleShowPass = () => setShowPass(showPass === "password" ? "text" : "password");

  async function handleRegister(values) {
    const loadingToast = toast.loading("Creating account...");
    try {
      const { data } = await authAPI.register(values);
      toast.success(`Welcome to FreshCart, ${data.data.user.name}!`);
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").min(3).max(25),
      email: Yup.string().required("Email is required").email("Invalid email"),
      phone: Yup.string().required("Phone is required").matches(phoneRegex, "Invalid phone"),
      password: Yup.string().required("Password is required").matches(passRegex, "Must contain 8+ chars, uppercase, lowercase, number and special character"),
      rePassword: Yup.string().required("Please confirm password").oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: handleRegister,
  });

  return (
    <LoginProtectedRoute>
      <section>
        <div className="container">
          <h2 className="flex justify-center items-center gap-2 mb-6 text-3xl text-primary font-bold">
            <FaRegUser /> Register Now
          </h2>
          <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto px-5 flex flex-col gap-5">
            {[
              { name: "name", type: "text", placeholder: "Enter Your Name" },
              { name: "email", type: "email", placeholder: "Enter Your Email" },
              { name: "phone", type: "tel", placeholder: "Enter Your Phone" },
            ].map(({ name, type, placeholder }) => (
              <div key={name}>
                <input className="py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary"
                  type={type} id={name} placeholder={placeholder} name={name}
                  value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors[name] && formik.touched[name] && (
                  <p className="text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm">{formik.errors[name]}</p>
                )}
              </div>
            ))}
            {["password", "rePassword"].map((field) => (
              <div key={field}>
                <div className="relative">
                  <input className="py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary"
                    type={showPass} id={field} name={field}
                    placeholder={field === "password" ? "Enter Your Password" : "Confirm Password"}
                    value={formik.values[field]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  <span onClick={toggleShowPass} className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:text-dark-primary transition-colors">
                    {showPass === "password" ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {formik.errors[field] && formik.touched[field] && (
                  <p className="text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm">{formik.errors[field]}</p>
                )}
              </div>
            ))}
            <button type="submit" className="py-2 px-6 rounded-sm text-white bg-primary hover:bg-dark-primary w-full cursor-pointer transition-all duration-300">Sign Up</button>
            <Link className="text-sm block text-primary text-center hover:underline" href="/login">Already have an account?</Link>
          </form>
        </div>
      </section>
    </LoginProtectedRoute>
  );
}

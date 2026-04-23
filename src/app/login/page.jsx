"use client";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { authContext } from "@/context/AuthContextProvider";
import { authAPI } from "@/lib/apiClient";
import LoginProtectedRoute from "@/components/LoginProtectedRoute/LoginProtectedRoute";

export default function LoginPage() {
  const { setToken } = useContext(authContext);
  const [showPass, setShowPass] = useState("password");
  const router = useRouter();

  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const toggleShowPass = () => setShowPass(showPass === "password" ? "text" : "password");

  async function handleLogin(values) {
    const loadingToast = toast.loading("Signing in...");
    try {
      const { data } = await authAPI.login(values);
      localStorage.setItem("userId", data.data.user._id);
      setToken(data.data.token, data.data.user);
      toast.success(`Welcome back, ${data.data.user.name}!`);
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email("Invalid email"),
      password: Yup.string().required("Password is required").matches(passRegex,
        "Must contain 8+ chars, uppercase, lowercase, number and special character"),
    }),
    onSubmit: handleLogin,
  });

  return (
    <LoginProtectedRoute>
      <section>
        <div className="container">
          <h2 className="flex justify-center items-center gap-2 text-3xl text-primary font-bold mb-6 mt-1.5">
            <FaRegUser /> Log in
          </h2>
          <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto px-5 flex flex-col gap-3">
            <div>
              <input className="py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary"
                type="email" id="email" placeholder="Enter Your Email" name="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input className="py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary"
                  type={showPass} id="password" placeholder="Enter Your Password" name="password"
                  value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                <span onClick={toggleShowPass} className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:text-dark-primary transition-colors">
                  {showPass === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm">{formik.errors.password}</p>
              )}
            </div>
            <button type="submit" className="py-2 px-6 rounded-sm text-white bg-primary hover:bg-dark-primary w-full cursor-pointer transition-all duration-300">Log in</button>
            <Link className="text-sm block text-primary text-center hover:underline" href="/forgot-password">Forgot your password?</Link>
            <Link href="/register" className="w-fit mx-auto py-2 px-6 rounded-sm text-white text-sm bg-primary hover:bg-dark-primary cursor-pointer transition-all duration-300">Create New Account</Link>
          </form>
        </div>
      </section>
    </LoginProtectedRoute>
  );
}

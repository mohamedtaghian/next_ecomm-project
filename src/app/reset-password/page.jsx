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

export default function Page() {
  const [showPass, setShowPass] = useState("password");
  const router = useRouter();
  const toggleShowPass = () => setShowPass(showPass === "password" ? "text" : "password");
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const configs = {
    "forgot-password": {
      title: "Forgot your password?",
      subtitle: "Your password will be reset by email.",
      fields: [{ name: "email", type: "email", placeholder: "Enter Your Email" }],
      schema: Yup.object({ email: Yup.string().required("Email required").email("Invalid email") }),
      init: { email: "" },
      submit: async (vals) => { const { data } = await authAPI.forgotPassword(vals); toast.success(data.message); router.push("/verify-reset-code"); },
      btn: "Send Reset Code",
    },
    "verify-reset-code": {
      title: "Verify Your Code",
      fields: [{ name: "resetCode", type: "password", placeholder: "Enter 6-digit Code", showToggle: true }],
      schema: Yup.object({ resetCode: Yup.string().required("Code required").matches(/^[0-9]+$/, "Digits only").length(6, "Must be 6 digits") }),
      init: { resetCode: "" },
      submit: async (vals) => { await authAPI.verifyResetCode(vals); toast.success("Code verified!"); router.push("/reset-password"); },
      btn: "Verify",
    },
    "reset-password": {
      title: "Reset your password",
      fields: [
        { name: "email", type: "email", placeholder: "Enter Your Email" },
        { name: "newPassword", type: "password", placeholder: "Enter New Password", showToggle: true },
      ],
      schema: Yup.object({
        email: Yup.string().required("Email required").email("Invalid email"),
        newPassword: Yup.string().required("Password required").matches(passRegex, "Must contain 8+ chars, upper, lower, number, special"),
      }),
      init: { email: "", newPassword: "" },
      submit: async (vals) => { await authAPI.resetPassword(vals); toast.success("Password reset!"); router.push("/login"); },
      btn: "Confirm",
    },
  };

  const path = typeof window !== "undefined" ? window.location.pathname.slice(1) : "forgot-password";
  const cfg = configs[path] || configs["forgot-password"];

  const formik = useFormik({ initialValues: cfg.init, validationSchema: cfg.schema,
    onSubmit: async (vals) => {
      const t = toast.loading("Please wait...");
      try { await cfg.submit(vals); }
      catch (err) { toast.error(err.response?.data?.message || "An error occurred"); }
      finally { toast.dismiss(t); }
    },
  });

  return (
    <LoginProtectedRoute>
      <section>
        <div className="container">
          <div className="flex flex-col justify-center items-center gap-3 my-8">
            <h2 className="flex justify-center items-center gap-2 text-3xl text-primary font-bold">
              <FaRegUser /> {cfg.title}
            </h2>
            {cfg.subtitle && <p className="text-gray-500 text-sm">{cfg.subtitle}</p>}
          </div>
          <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto px-5 flex flex-col gap-5">
            {cfg.fields.map((f) => (
              <div key={f.name}>
                <div className="relative">
                  <input
                    className="py-1 px-2 bg-gray-50 border outline-0 border-gray-300 text-dark-primary placeholder:text-gray-400 rounded-sm focus:border-primary block w-full transition-all duration-300 caret-primary"
                    type={f.showToggle ? showPass : f.type}
                    name={f.name} id={f.name} placeholder={f.placeholder}
                    value={formik.values[f.name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {f.showToggle && (
                    <span onClick={toggleShowPass} className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:text-dark-primary transition-colors">
                      {showPass === "password" ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </div>
                {formik.errors[f.name] && formik.touched[f.name] && (
                  <p className="text-red-600 font-bold text-sm mt-1 bg-red-100 py-1 px-2 rounded-sm">{formik.errors[f.name]}</p>
                )}
              </div>
            ))}
            <button type="submit" className="py-2 px-6 rounded-sm text-white bg-primary hover:bg-dark-primary w-full cursor-pointer transition-all duration-300">{cfg.btn}</button>
            <Link className="text-sm block text-primary text-center font-bold hover:underline" href="/login">Back to log in</Link>
          </form>
        </div>
      </section>
    </LoginProtectedRoute>
  );
}

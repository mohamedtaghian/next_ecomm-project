"use client";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();
  return (
    <div className="container">
      <button
        onClick={() => router.back()}
        className="bg-primary text-white p-2.5 rounded-full flex justify-center items-center cursor-pointer hover:bg-dark-primary hover:-translate-x-1 hover:scale-105 transition-all duration-300"
      >
        <FaArrowLeft />
      </button>
    </div>
  );
}

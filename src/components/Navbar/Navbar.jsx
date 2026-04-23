"use client";
import React, { useContext, useState } from "react";
import { FaBars, FaFacebook, FaInstagram, FaLinkedin, FaOpencart, FaRegHeart, FaUserShield } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authContext } from "@/context/AuthContextProvider";
import toast from "react-hot-toast";
import { cartContext } from "@/context/CartContextProvider";
import { wishContext } from "@/context/WishlistProvider";

function NavLinkItem({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`hover:text-primary duration-300 ${isActive ? "active-link" : ""}`}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { token, setToken, user } = useContext(authContext);
  const { cartProducts } = useContext(cartContext);
  const { wish } = useContext(wishContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    const t = toast.loading("Logging out...");
    setTimeout(() => toast.dismiss(t), 1000);
    setTimeout(() => {
      setToken(null);
      toast.success("Logged out");
      router.push("/login");
    }, 1500);
  };

  const wishCount = wish?.count || 0;
  const cartCount = cartProducts?.numOfCartItems || 0;

  const navLinks = token ? (
    <ul className="flex flex-col md:flex-row items-center gap-4 text-gray-500">
      <li><NavLinkItem href="/">Home</NavLinkItem></li>
      <li><NavLinkItem href="/products">Products</NavLinkItem></li>
      <li><NavLinkItem href="/categories">Categories</NavLinkItem></li>
      <li><NavLinkItem href="/brands">Brands</NavLinkItem></li>
      <li><NavLinkItem href="/allorders">Orders</NavLinkItem></li>
      {user?.role === "admin" && (
        <li>
          <NavLinkItem href="/admin">
            <span className="flex items-center gap-1 text-primary font-semibold">
              <FaUserShield /> Admin
            </span>
          </NavLinkItem>
        </li>
      )}
    </ul>
  ) : null;

  const iconLinks = token ? (
    <ul className="flex items-center gap-2">
      <li className="relative">
        <Link href="/whish-list">
          <FaRegHeart className="size-5 text-dark-primary hover:text-primary duration-300" />
        </Link>
        {wishCount > 0 && (
          <span className="absolute -top-1 left-1 -translate-x-1/2 -translate-y-1/2 bg-primary text-xs text-white size-5 rounded-full flex justify-center items-center">
            {wishCount}
          </span>
        )}
      </li>
      <li className="relative">
        <Link href="/cart">
          <FaOpencart className="text-primary size-5 hover:text-dark-primary duration-300" />
        </Link>
        {cartCount > 0 && (
          <span className="absolute -top-1 left-1 -translate-x-1/2 -translate-y-1/2 bg-primary text-xs text-white size-5 rounded-full flex justify-center items-center">
            {cartCount}
          </span>
        )}
      </li>
    </ul>
  ) : null;

  const socialLinks = (
    <ul className="flex items-center gap-2">
      {[
        { href: "https://www.facebook.com/", icon: <FaFacebook className="text-[#1877F2] size-4" /> },
        { href: "https://www.instagram.com/", icon: <FaInstagram className="text-[#e1306c] size-4" /> },
        { href: "https://x.com/", icon: <FaXTwitter className="size-4" /> },
        { href: "https://www.linkedin.com/", icon: <FaLinkedin className="text-[#0a66c2] size-4" /> },
      ].map(({ href, icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noreferrer" className="hover:-translate-y-1 duration-300 block">
            {icon}
          </a>
        </li>
      ))}
    </ul>
  );

  const authLinks = token ? (
    <ul className="flex items-center gap-2 text-gray-500">
      <li>
        <button onClick={logout} className="cursor-pointer hover:text-red-600 transition-all duration-300">
          Logout
        </button>
      </li>
    </ul>
  ) : (
    <ul className="flex items-center gap-2 text-gray-500">
      <li><NavLinkItem href="/login">Login</NavLinkItem></li>
      <li><NavLinkItem href="/register">Sign up</NavLinkItem></li>
    </ul>
  );

  return (
    <header className="bg-main-light py-4 fixed top-0 left-0 w-full z-[999]">
      <div className="container flex justify-between items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-dark-primary">
          <FaOpencart className="text-primary size-7" /> FreshCart
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-dark-primary md:hidden size-4 cursor-pointer">
          <FaBars />
        </button>
        {/* Desktop */}
        <nav className="hidden flex-1 md:flex gap-2.5">
          {navLinks}
          <div className="ms-auto flex items-center gap-5">
            {iconLinks}
            {socialLinks}
            {authLinks}
          </div>
        </nav>
      </div>
      {/* Mobile */}
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col items-center gap-5 py-5">
            {navLinks}
            <div className="flex flex-col items-center gap-4">
              {iconLinks}
              {socialLinks}
              {authLinks}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

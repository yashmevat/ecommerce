"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminNavbar() {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getSession().then((sess) => {
      if (!sess) {
        window.location.href = "/signin"; // redirect if not logged in
      } else if (sess.user.role !== "admin") {
        window.location.href = "/customer/dashboard"; // redirect if not admin
      } else {
        setSession(sess); // set session if admin
      }
    });
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Navbar will render immediately; session-dependent info will update when available
  return (
    <nav className="w-full bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo / Brand */}
        <Link href="/admin/dashboard" className="text-xl font-bold text-blue-400">
          Admin Dashboard
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link href="/admin/categories" className="hover:text-blue-400 transition">
            Categories
          </Link>
          <Link href="/admin/products" className="hover:text-blue-400 transition">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:text-blue-400 transition">
            Orders
          </Link>
        </div>

        {/* User Info + Logout */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm">
            {session?.user?.name || "Admin"} ({session?.user?.email || "Loading..."})
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-3 bg-gray-800">
          <Link
            href="/admin/categories"
            className="block hover:text-blue-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/admin/products"
            className="block hover:text-blue-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block hover:text-blue-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Orders
          </Link>

          <div className="border-t border-gray-700 pt-3 flex flex-col gap-2">
            <span className="text-sm text-gray-300">
              {session?.user?.name || "Admin"} ({session?.user?.email || "Loading..."})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

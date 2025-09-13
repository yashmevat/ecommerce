"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu, X, Tags, Package, ShoppingCart, User, LogOut
} from "lucide-react";

export default function AdminNavbar() {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getSession().then((sess) => {
      if (!sess) {
        window.location.href = "/signin";
      } else if (sess.user.role !== "admin") {
        window.location.href = "/customer/dashboard";
      } else {
        setSession(sess);
      }
    });
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo / Brand */}
        <Link
          href="/admin/dashboard"
          className="text-xl font-bold text-blue-400 flex items-center gap-2"
        >
          <Package size={22} className="text-blue-400" />
          Admin Dashboard
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink href="/admin/categories" label="Categories" icon={<Tags size={18} />} />
          <NavLink href="/admin/products" label="Products" icon={<Package size={18} />} />
          <NavLink href="/admin/orders" label="Orders" icon={<ShoppingCart size={18} />} />
        </div>

        {/* User Info + Logout */}
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <User size={18} className="text-blue-400" />
            {session?.user?.name || "Admin"} ({session?.user?.email || "Loading..."})
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-3 bg-gray-800">
          <NavLink
            href="/admin/categories"
            label="Categories"
            icon={<Tags size={18} />}
            onClick={() => setIsOpen(false)}
          />
          <NavLink
            href="/admin/products"
            label="Products"
            icon={<Package size={18} />}
            onClick={() => setIsOpen(false)}
          />
          <NavLink
            href="/admin/orders"
            label="Orders"
            icon={<ShoppingCart size={18} />}
            onClick={() => setIsOpen(false)}
          />

          <div className="border-t border-gray-700 pt-3 flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <User size={18} className="text-blue-400" />
              {session?.user?.name || "Admin"} ({session?.user?.email || "Loading..."})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center gap-2 w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable NavLink Component
function NavLink({ href, label, icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 hover:text-blue-400 transition"
    >
      {icon}
      {label}
    </Link>
  );
}

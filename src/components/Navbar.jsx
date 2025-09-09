"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function CustomerNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/customer/dashboard" },
    { name: "Products", href: "/customer/products" },
    { name: "Cart", href: "/customer/carts" },
    { name: "Orders", href: "/customer/orders" },
    { name: "Profile", href: "/customer/profile" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          ShopEasy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-gray-300 transition"
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <>
              <span>Hello, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
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
        <div className="md:hidden mt-2 space-y-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-2 px-3 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <button
             onClick={() => signOut({ callbackUrl: "/signin" })}

              className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/api/auth/signin"
              className="block w-full text-center bg-blue-600 py-2 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

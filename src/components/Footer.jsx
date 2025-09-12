"use client";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">ShopEase</h2>
          <p className="text-sm leading-6">
            Your one-stop shop for all things fashion, electronics, and more.
            Quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link href="/customer/products" className="hover:text-white">Shop</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
          <ul className="space-y-3">
            <li><Link href="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <p className="flex items-center gap-2"><Phone size={18}/> +91 98765 43210</p>
          <p className="flex items-center gap-2"><Mail size={18}/> support@shopease.com</p>
          <div className="flex gap-4 mt-4">
            <Link href="#" className="hover:text-white"><Facebook size={20}/></Link>
            <Link href="#" className="hover:text-white"><Twitter size={20}/></Link>
            <Link href="#" className="hover:text-white"><Instagram size={20}/></Link>
            <Link href="#" className="hover:text-white"><Youtube size={20}/></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}

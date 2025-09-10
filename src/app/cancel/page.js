"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <XCircle className="mx-auto text-red-500 w-16 h-16" />

        {/* Heading */}
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Your payment process was cancelled. Don’t worry, you can try again or
          continue browsing our store.
        </p>

        {/* Button */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition duration-200"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

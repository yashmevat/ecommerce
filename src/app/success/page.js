"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <CheckCircle2 className="mx-auto text-green-500 w-16 h-16" />

        {/* Heading */}
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Thank you for your purchase 🎉. Your payment has been processed
          successfully. We’ll send you an order confirmation email shortly.
        </p>

        {/* Button */}
        <div className="mt-6">
          <Link
            href="/customer/orders"
            className="inline-block px-6 py-3 rounded-xl bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition duration-200"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

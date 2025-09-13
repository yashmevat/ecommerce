"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
const stripePromise = loadStripe(
  process.env.STRIPE_PUBLISHABLE_KEY
);

export default function CustomerCheckout({ userId, cartTotal, onOrderPlaced, onClose ,cartItems}) {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!userId) return alert("User not logged in!");
    if (!details.name || !details.email || !details.address || !details.phone)
      return alert("Please fill all fields.");

    setLoading(true);

    // Simulate test payment
   if (paymentMethod === "testpay") {
  setLoading(true);

  const res = await fetch("/api/checkout/stripe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      details,
      userId,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }),
  });

  const { url, error } = await res.json();
  if (!res.ok) {
    alert("Stripe checkout error: " + error);
    setLoading(false);
    return;
  }

  window.location.href = url; // ✅ redirect directly to Stripe Checkout
  return;
}



    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, details, paymentMethod }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Order #${data.orderId} placed successfully! Total: ₹${data.totalAmount}`);
        onOrderPlaced?.(); // optional callback to refresh cart
        onClose?.(); // close modal
      } else {
        alert("Error placing order: " + data.error);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

 
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 text-black">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
    >
      ✕
    </button>

    {/* Title */}
    <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
      🛒 Checkout
    </h2>

    {/* Form */}
    <div className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={details.name}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={details.email}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <textarea
        name="address"
        placeholder="Shipping Address"
        value={details.address}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        rows="3"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={details.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Payment Method */}
      <div className="mt-4">
        <p className="font-semibold mb-3 text-gray-800">Payment Method</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer transition 
              ${
                paymentMethod === "cod"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="hidden"
            />
            💵 Cash on Delivery
          </label>

          <label
            className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer transition 
              ${
                paymentMethod === "testpay"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
          >
            <input
              type="radio"
              name="payment"
              value="testpay"
              checked={paymentMethod === "testpay"}
              onChange={() => setPaymentMethod("testpay")}
              className="hidden"
            />
            💳 Pay with TestPay
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Total: <span className="text-green-600">₹{cartTotal}</span>
        </p>
        <button
          onClick={placeOrder}
          disabled={loading}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:-translate-y-0.5"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  </div>
</div>

  );
}

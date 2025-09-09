"use client";

import { useState } from "react";

export default function CustomerCheckout({ userId, cartTotal, onOrderPlaced, onClose }) {
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
      alert("Redirecting to TestPay (simulated)...");
      await new Promise((r) => setTimeout(r, 1500));
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...details, paymentMethod }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={details.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={details.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={details.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={details.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="mt-4">
            <p className="font-semibold mb-2">Payment Method</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="testpay"
                  checked={paymentMethod === "testpay"}
                  onChange={() => setPaymentMethod("testpay")}
                />
                Pay with TestPay
              </label>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold">Total: ₹{cartTotal}</p>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

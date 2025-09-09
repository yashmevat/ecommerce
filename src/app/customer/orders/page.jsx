"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function CustomerOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${userId}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  async function viewOrderItems(orderId) {
    try {
      const res = await fetch(`/api/orders/items/${orderId}`);
      const data = await res.json();
      setSelectedOrderItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading session...</p>
      </div>
    );
  if (!session)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Please login to view your orders.</p>
      </div>
    );
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
          🧾 Your Orders
        </h1>
{orders.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
    <img
      src="https://cdn-icons-png.flaticon.com/256/11329/11329060.png" // Empty orders icon
      alt="No orders"
      className="w-40 h-40 mb-6 opacity-80"
    />
    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
    <p className="text-gray-600 mb-6">
      You haven’t placed any orders yet. Start shopping now!
    </p>
    <a
      href="/customer/products"
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition transform hover:-translate-y-1 hover:shadow-lg"
    >
      🛍️ Browse Products
    </a>
  </div>
) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p>
                    <span className="font-semibold">Order ID:</span> {order.id}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ₹{order.total_amount}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => viewOrderItems(order.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  View Items
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedOrderItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedOrderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex gap-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-800 font-semibold">₹{item.price*item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

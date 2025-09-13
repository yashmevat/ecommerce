"use client";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${filter}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    try {
      setLoading(true);
      await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          📦 Manage Orders
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm capitalize shadow-sm transition-all duration-200
              ${
                filter === s
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
              >
                {s}
              </button>
            )
          )}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-left text-sm uppercase tracking-wide">
                <th className="p-5">Order ID</th>
                <th className="p-5">Customer</th>
                <th className="p-5">Total</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-5 font-mono text-blue-600 font-bold">
                      #{order.id}
                    </td>
                    <td className="p-5 font-medium text-gray-800">
                      {order.customer_name}
                    </td>
                    <td className="p-5 font-semibold text-green-600">
                      ₹{order.total_amount}
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm
                          ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "paid"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 cursor-pointer hover:border-blue-400 transition"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500 italic"
                  >
                    🚫 No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}

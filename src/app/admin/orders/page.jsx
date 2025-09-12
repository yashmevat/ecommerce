"use client";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?status=${filter}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
        setLoading(false)
      console.error("Error fetching orders:", err);
    }
    setLoading(false)
  }

  async function updateStatus(orderId, newStatus) {
    try {
        setLoading(true)
      await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({orderId:orderId, status: newStatus }),
      });
      fetchOrders();
      setLoading(false) // Refresh after update
    } catch (err) {
        setLoading(false)
      console.error("Error updating status:", err);
    }
  }

  if(loading){
    return <Loader/>
  }

  return (
   <div className="min-h-screen bg-gray-50">
  <AdminNavbar />

  <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-6 text-center">
    📦 Manage Orders
  </h1>

  {/* Filter */}
  <div className="flex flex-wrap gap-3 mb-6 justify-center">
    {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
      <button
        key={s}
        onClick={() => setFilter(s)}
        className={`px-4 py-2 rounded-xl font-medium text-sm capitalize transition-all duration-200
          ${
            filter === s
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border hover:bg-gray-100"
          }`}
      >
        {s}
      </button>
    ))}
  </div>

  {/* Orders Table */}
  <div className="max-w-5xl mx-auto overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
    <table className="min-w-full text-sm md:text-base">
      <thead>
        <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wide">
          <th className="p-4">Order ID</th>
          <th className="p-4">Customer</th>
          <th className="p-4">Total</th>
          <th className="p-4">Status</th>
          <th className="p-4">Date</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr
              key={order.id}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              <td className="p-4 font-mono text-blue-600 font-medium">
                #{order.id}
              </td>
              <td className="p-4">{order.customer_name}</td>
              <td className="p-4 font-semibold text-gray-800">
                ₹{order.total_amount}
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize
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
              <td className="p-4 text-gray-600">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="p-4">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 cursor-pointer hover:border-blue-400 transition"
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
            <td colSpan="6" className="text-center p-6 text-gray-500">
              🚫 No orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  <Footer/>
</div>


  );
}

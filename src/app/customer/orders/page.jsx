"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

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

  async function cancelOrder(orderId) {
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        body: JSON.stringify({
          orderId,
          status: "cancelled",
        }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!session)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please login to view your orders.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <h1 className="text-center font-extrabold text-4xl mt-8 text-gray-900 tracking-tight">
        My Orders
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Empty Orders */}
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
              <img
                src="https://cdn-icons-png.flaticon.com/256/11329/11329060.png"
                alt="No orders"
                className="w-44 h-44 mb-6 opacity-90 drop-shadow-md"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg text-sm md:text-base">
                You haven’t placed any orders yet. Start shopping now and enjoy
                exclusive deals on our wide range of products!
              </p>
              <a
                href="/customer/products"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md transition transform hover:-translate-y-1 hover:shadow-xl"
              >
                🛍️ Browse Products
              </a>
            </div>
          ) : (
            <div className="grid gap-6 h-[55vh] overflow-y-auto custom-scroll">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100 animate-fadeIn"
                >
                  {/* Order Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>
                      <p className="font-semibold text-gray-800 break-all">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Total
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        ₹{order.total_amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Date
                      </p>
                      <p className="text-gray-700">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`inline-block px-4 py-1 rounded-full text-xs md:text-sm font-medium mt-2 transition
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => viewOrderItems(order.id)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
                    >
                      View Items
                    </button>

                    {order.status !== "shipped" &&
                      order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition shadow-md"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Items */}
          {selectedOrderItems.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Order Items
              </h2>

              <div className="h-[500px] overflow-y-auto pr-2 custom-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {selectedOrderItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-44 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="p-4 space-y-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-500 mt-10 shadow-inner">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
                alt="No order"
                className="w-12 h-12 mb-3 opacity-70"
              />
              <p className="font-medium text-gray-700">No Order Selected</p>
              <span className="text-sm text-gray-500">
                Please choose an order to view details
              </span>
            </div>
          )}
        </div>
      )}
      <Footer/>
    </div>
  );
}

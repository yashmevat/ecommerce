"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import AdminNavbar from "@/components/AdminNavbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    products: 0,
    categories: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    getSession().then((sess) => {
      if (!sess) {
        window.location.href = "/signin";
      } else if (sess.user.role !== "admin") {
        window.location.href = "/customer/dashboard";
      } else {
        setSession(sess);
        fetchDashboardData();
      }
    });
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/admin/categories"),
        fetch("/api/orders"),
      ]);

      const [products, categories, orders] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        ordersRes.json(),
      ]);

      const pendingOrders = orders.filter(
        (o) => o.status.toLowerCase() === "pending"
      ).length;

      const uniqueCustomers = new Set(orders.map((o) => o.user_id)).size;

      setStats({
        pendingOrders,
        products: products.length,
        categories: categories.length,
        customers: uniqueCustomers,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  if (!session) return <p>Loading...</p>;

  // 🔹 Prepare chart data
  const statsData = [
    { name: "Pending Orders", value: stats.pendingOrders },
    { name: "Products", value: stats.products },
    { name: "Categories", value: stats.categories },
    { name: "Customers", value: stats.customers },
  ];

  const orderStatusData = [
    { name: "Pending", value: recentOrders.filter(o => o.status.toLowerCase() === "pending").length },
    { name: "Completed", value: recentOrders.filter(o => o.status.toLowerCase() === "completed").length },
    { name: "Cancelled", value: recentOrders.filter(o => o.status.toLowerCase() === "cancelled").length },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"]; // blue, green, yellow

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome, {session.user?.name} 👋
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Pending Orders" value={stats.pendingOrders} color="text-blue-600" />
          <DashboardCard title="Total Products" value={stats.products} color="text-green-600" />
          <DashboardCard title="Categories" value={stats.categories} color="text-purple-600" />
          <DashboardCard title="Customers" value={stats.customers} color="text-orange-600" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Bar Chart */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Overview (Bar Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status (Pie Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white shadow rounded-xl p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Recent Orders (Line Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentOrders}>
                <XAxis dataKey="id" label={{ value: "Order ID", position: "insideBottomRight", offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_amount" stroke="#10B981" name="Order Total ₹" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-12 bg-white shadow rounded-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">{order.user_id}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">₹{order.total_amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center justify-center">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

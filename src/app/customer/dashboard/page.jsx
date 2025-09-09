"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0 });

  // Fetch customer orders
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/orders?user_id=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          const pending = data.filter((o) => o.status === "pending").length;
          const approved = data.filter((o) => o.status === "approved").length;
          setStats({ pending, approved });
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [session]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading session...</p>
      </div>
    );

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Our Store</h1>
        <p className="mb-6 text-gray-600">Please login to access your dashboard.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Login
        </button>
      </div>
    );

  // Chart Data
  const chartData = [
    { name: "Pending Orders", value: stats.pending },
    { name: "Approved Orders", value: stats.approved },
  ];

  const COLORS = ["#F59E0B", "#10B981"]; // yellow, green

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          👋 Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-600 mb-12">
          Here's an overview of your orders and activities.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="🟡 Pending Orders" value={stats.pending} subtitle="Awaiting approval" />
          <DashboardCard title="🟢 Approved Orders" value={stats.approved} subtitle="Completed successfully" />
          <DashboardCard title="🛒 Total Orders" value={orders.length} subtitle="All placed orders" />
          <DashboardCard title="👤 Profile" value={session.user.name} subtitle={session.user.email} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Order Status Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Orders Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <ActionButton label="Browse Products" color="blue" />
            <ActionButton label="View Cart" color="green" />
            <ActionButton label="Wishlist" color="purple" />
            <ActionButton label="Logout" color="red" onClick={signOut} />
          </div>
        </div> */}
      </div>
    </>
  );
}

// Dashboard Card Component
function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
      <p className="mt-1 text-gray-500">{subtitle}</p>
    </div>
  );
}

// Quick Action Button Component
function ActionButton({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg font-semibold transition`}
    >
      {label}
    </button>
  );
}

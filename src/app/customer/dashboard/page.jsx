"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis
} from "recharts";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch customer orders
  useEffect(() => {
    setLoading(true);
    if (session?.user?.id) {
      fetch(`/api/orders/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);

          // Count each status dynamically
          const statusCounts = data.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {});

          setStats(statusCounts);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
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

  // Convert stats into chart-friendly format
  const chartData = Object.entries(stats).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  // Dynamic colors
  const COLORS = [
    "#F59E0B", // yellow
    "#10B981", // green
    "#3B82F6", // blue
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  return (
    <>

      <div className="max-w-full">
      <Navbar />
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-600 mb-12">
          Here's an overview of your orders and activities.
        </p>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(stats).map(([status, value]) => (
                <DashboardCard
                  key={status}
                  title={`${status.charAt(0).toUpperCase() + status.slice(1)} Orders`}
                  value={value}
                  subtitle={`Total ${status}`}
                />
              ))}
              <DashboardCard
                title="Total Orders"
                value={orders.length}
                subtitle="All placed orders"
              />
              <DashboardCard
                title="Profile"
                value={session.user.name}
                subtitle={session.user.email}
              />
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
                <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
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
          </>
        )}
      <Footer/>
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

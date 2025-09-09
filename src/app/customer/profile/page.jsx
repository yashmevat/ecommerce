"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700">Loading session...</p>
      </div>
    );

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Profile Page</h1>
        <p className="mb-6 text-gray-600">Please login to view your profile.</p>
      </div>
    );

  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          👤 Your Profile
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <img
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />

          {/* Profile Info */}
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Name</h2>
              <p className="text-gray-600">{user.name}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">Email</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">Member Since</h2>
              <p className="text-gray-600">2025</p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                Edit Profile
              </button>
              <button
                onClick={() => signOut()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // ====== Fetch ======
  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  // ====== Add ======
  async function addCategory() {
    if (!newCat.name.trim() || !newCat.description.trim()) return;
    setLoading(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setNewCat({ name: "", description: "" });
    fetchCategories();
    setLoading(false);
  }

  // ====== Update ======
  async function updateCategory(id) {
    setLoading(true);
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    fetchCategories();
    setLoading(false);
  }

  // ====== Delete ======
  async function deleteCategory(id) {
    setLoading(true);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 text-center">
          Manage Categories
        </h1>

        {/* Add Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 border border-purple-100 shadow-xl rounded-3xl p-8 mb-12"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600" /> Add New Category
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="Category name"
              className="w-full border border-purple-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
            />
            <textarea
              value={newCat.description}
              onChange={(e) =>
                setNewCat({ ...newCat, description: e.target.value })
              }
              placeholder="Category description"
              className="w-full border border-purple-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
            />
            <button
              onClick={addCategory}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white px-5 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              <Plus className="w-5 h-5" /> Add Category
            </button>
          </div>
        </motion.div>

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/70 border border-indigo-100 shadow-xl rounded-3xl p-8"
        >
          <h2 className="text-xl font-bold mb-6 text-indigo-700">
            Categories
          </h2>

          {categories.length === 0 ? (
            <p className="text-gray-500 italic">No categories available.</p>
          ) : (
            <ul className="space-y-5">
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.li
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gradient-to-br from-gray-50 to-white"
                  >
                    {editing === cat.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => updateCategory(cat.id)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cat.description || "No description provided"}
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => {
                              setEditing(cat.id);
                              setEditData({
                                name: cat.name,
                                description: cat.description,
                              });
                            }}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

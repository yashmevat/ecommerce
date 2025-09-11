"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const[loading,setLoading] = useState(false)

  // ====== Fetch ======
  async function fetchCategories() {
    setLoading(true)
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false)
  }

  // ====== Add ======
  async function addCategory() {
    setLoading(true)
    if (!newCat.name.trim() || !newCat.description.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setNewCat({ name: "", description: "" });
    fetchCategories();
    setLoading(false)
  }

  // ====== Update ======
  async function updateCategory(id) {
    setLoading(true)
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    fetchCategories();
    setLoading(false)
  }

  // ====== Delete ======
  async function deleteCategory(id) {
    setLoading(true)
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if(loading){
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Categories
        </h1>

        {/* Add Category */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" /> Add New Category
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="Category name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            />
            <textarea
              value={newCat.description}
              onChange={(e) =>
                setNewCat({ ...newCat, description: e.target.value })
              }
              placeholder="Category description"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              onClick={addCategory}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-lg transition"
            >
              <Plus className="w-5 h-5" /> Add Category
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Categories
          </h2>

          {categories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.li
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border p-5 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    {editing === cat.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => updateCategory(cat.id)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cat.description || "No description provided"}
                        </p>
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => {
                              setEditing(cat.id);
                              setEditData({
                                name: cat.name,
                                description: cat.description,
                              });
                            }}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });

  // ====== Fetch ======
  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  // ====== Add ======
  async function addCategory() {
    if (!newCat.name.trim() || !newCat.description.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setNewCat({ name: "", description: "" });
    fetchCategories();
  }

  // ====== Update ======
  async function updateCategory(id) {
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    fetchCategories();
  }

  // ====== Delete ======
  async function deleteCategory(id) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Categories
        </h1>

        {/* Add Category */}
        <div className="bg-white shadow rounded-xl p-4 mb-8 space-y-3">
          <input
            type="text"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            placeholder="Enter category name"
            className="w-full border p-2 rounded focus:ring focus:ring-green-300"
          />
          <textarea
            value={newCat.description}
            onChange={(e) =>
              setNewCat({ ...newCat, description: e.target.value })
            }
            placeholder="Enter category description"
            className="w-full border p-2 rounded focus:ring focus:ring-green-300"
          />
          <button
            onClick={addCategory}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow w-full"
          >
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="border p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  {editing === cat.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
                      />
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCategory(cat.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cat.description || "No description"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditing(cat.id);
                            setEditData({
                              name: cat.name,
                              description: cat.description,
                            });
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

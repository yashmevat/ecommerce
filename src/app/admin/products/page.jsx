"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Plus, Edit3, Trash2, Save, RefreshCw } from "lucide-react";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image_url: "",
    category_id: "",
  });
  const [editing, setEditing] = useState(null);

  // ====== Fetch Data ======
  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  // ====== CRUD ======
  async function addProduct() {
    if (!form.name || !form.price) return;
    setLoading(true);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    fetchProducts();
    setLoading(false);
  }

  async function updateProduct(id) {
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    setEditing(null);
    fetchProducts();
    setLoading(false);
  }

  async function deleteProduct(id) {
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
    setLoading(false);
  }

  function resetForm() {
    setForm({
      name: "",
      price: "",
      description: "",
      stock: "",
      image_url: "",
      category_id: "",
    });
    setEditing(null);
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-10 text-center">
          Manage Products
        </h1>

        {/* Add / Edit Product Form */}
        <div className="backdrop-blur-xl bg-white/70 border border-purple-100 shadow-xl rounded-3xl p-10 mb-14">
          <h2 className="text-2xl font-bold mb-8 text-indigo-700 flex items-center gap-3">
            <Plus className="w-6 h-6 text-purple-600" />
            {editing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/product.jpg"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
              />
            </div>

            {/* Live Preview */}
            {form.image_url && (
              <div className="md:col-span-2 flex justify-center">
                <div className="p-5 border border-indigo-100 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-md">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl"
                  />
                  <p className="mt-3 text-center text-sm text-gray-500 italic">
                    Live Preview
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm resize-none"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            {editing ? (
              <button
                onClick={() => updateProduct(editing)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                <Save className="w-4 h-4" /> Update Product
              </button>
            ) : (
              <button
                onClick={addProduct}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 text-white px-6 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}

            {/* Reset button */}
            <button
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-md transition"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Product List */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-indigo-700">
            Product List
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-500 italic">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="backdrop-blur-lg bg-white/80 border border-indigo-100 rounded-3xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-[1.02] p-6 flex flex-col"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-200 flex items-center justify-center rounded-xl mb-4 text-gray-400">
                      No Image
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category_name}</p>
                  <p className="mt-2 text-green-600 font-bold">₹{p.price}</p>
                  <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => {
                        setEditing(p.id);
                        setForm({
                          name: p.name,
                          price: p.price,
                          description: p.description,
                          stock: p.stock,
                          image_url: p.image_url,
                          category_id: p.category_id,
                        });
                      }}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm shadow"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

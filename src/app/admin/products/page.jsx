"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Plus, Edit3, Trash2, Save } from "lucide-react";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,setLoading]=useState(false)
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
    setLoading(true)
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false)
  }

  async function fetchCategories() {
    setLoading(true)
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false)
  }

  // ====== CRUD ======
  async function addProduct() {
    setLoading(true)
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    fetchProducts();
    setLoading(false)
  }

  async function updateProduct(id) {
    setLoading(true)
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    setEditing(null);
    fetchProducts();
    setLoading(false)
  }

  async function deleteProduct(id) {
    setLoading(true)
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
    setLoading(false)
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
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  if(loading){
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Products</h1>

        {/* Add / Edit Product Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            {editing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none col-span-1 md:col-span-2"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            {editing ? (
              <button
                onClick={() => updateProduct(editing)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
              >
                <Save className="w-4 h-4" /> Update Product
              </button>
            ) : (
              <button
                onClick={addProduct}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Product List */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Product List</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4 text-gray-400">
                      No Image
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category_name}</p>
                  <p className="mt-2 text-green-600 font-bold">₹{p.price}</p>
                  <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.description}</p>

                  <div className="flex gap-3 mt-4">
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
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
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
      <Footer/>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  // ====== CRUD ======
  async function addProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    fetchProducts();
  }

  async function updateProduct(id) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    setEditing(null);
    fetchProducts();
  }

  async function deleteProduct(id) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
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

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Products
        </h1>

        {/* Add / Edit Product Form */}
        <div className="bg-white shadow rounded-xl p-4 md:p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 w-full"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 w-full"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 w-full"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 w-full"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 col-span-1 md:col-span-2 w-full"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-300 w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            {editing ? (
              <button
                onClick={() => updateProduct(editing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow w-full md:w-auto"
              >
                Update Product
              </button>
            ) : (
              <button
                onClick={addProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow w-full md:w-auto"
              >
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white shadow rounded-xl p-4 md:p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Product List</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3">{p.category_name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 text-gray-600">{p.description}</td>
                    <td className="p-3 flex gap-2 justify-center flex-wrap">
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

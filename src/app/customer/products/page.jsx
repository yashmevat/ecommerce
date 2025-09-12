"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let url = "/api/products";
        if (selectedCategory) url += `?category_id=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading session...</p>
      </div>
    );
  }

  async function addToCart(productId) {
    const quantity = quantities[productId] || 1;
    if (!userId) {
      alert("Please login first");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      if (res.ok) {
        alert(`Added ${quantity} item(s) to cart ✅`);
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          🛍 Products
        </h1>

        {!session && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => signIn()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Login to Add Products
            </button>
          </div>
        )}

        {/* Category Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="border border-gray-300 rounded-lg p-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loader */}
        {loading ? (
         <Loader/>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found 😢</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 flex flex-col"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold mt-2">₹{product.price}</p>

                {/* Quantity Input */}
                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor={`qty-${product.id}`} className="text-gray-700">
                    Qty:
                  </label>
                  <input
                    id={`qty-${product.id}`}
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [product.id]: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-16 border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!userId || loading}
                  className={`mt-4 py-2 rounded-lg text-white font-semibold transition ${
                    userId && !loading
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {userId ? "Add to Cart" : "Login to Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

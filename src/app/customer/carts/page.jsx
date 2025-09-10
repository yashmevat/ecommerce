"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import CustomerCheckout from "@/components/CustomerCheckout";

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  const userId = session?.user?.id;

   useEffect(()=>{
     if(cartItems){
      console.log(cartItems)
     }
  },[cartItems])

  // Fetch cart items
  async function fetchCart() {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${userId}`);
      const data = await res.json();
      setCartItems(data);

      // Initialize quantities
      const initialQuantities = {};
      data.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading session...</p>
      </div>
    );
  if (!session)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Please login to view your cart.</p>
      </div>
    );
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading cart...</p>
      </div>
    );
if (cartItems.length === 0)
  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" // ✅ You can replace with your custom empty-cart image
        alt="Empty Cart"
        className="w-40 h-40 mb-6 opacity-80"
      />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Your cart is empty 😢
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Looks like you haven’t added anything yet. Explore our products and add
        them to your cart.
      </p>
      <a
        href="/customer/products"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
      >
        🛍️ Start Shopping
      </a>
    </div>
    
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          🛒 Your Cart
        </h1>

        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white rounded-2xl shadow hover:shadow-lg transition p-4 gap-4"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full sm:w-28 h-28 object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-500">₹{item.price}</p>

                {/* Quantity Input */}
                <div className="flex items-center gap-2 mt-1">
                  <label className="text-gray-700">Qty:</label>
                  <input
                    type="number"
                    min={0}
                    value={quantities[item.id] || 0}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [item.id]: parseInt(e.target.value),
                      })
                    }
                    className="w-16 border border-gray-300 p-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow">
          <p className="text-xl font-semibold mb-4 sm:mb-0">Total: ₹{cartTotal}</p>
          <button
            onClick={() => setShowCheckout(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Proceed to Checkout
          </button>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <CustomerCheckout
            userId={userId}
            cartTotal={cartTotal}
            cartItems={cartItems}
            onOrderPlaced={fetchCart}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </div>
    </div>
  );
}

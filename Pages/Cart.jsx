import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/Authcontext";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user ,fetchCartCount} = useContext(AuthContext);
  const [updating, setUpdating] = useState({});
  const [limitReached, setLimitReached] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);


  const updateQuantity = async (productId, newQty) => {
  try {
    if (newQty < 1) return; // prevent 0 or negative

    await axios.put("/api/Cart/Update", {
      productId: productId,
      quantity: newQty
    });

    // 🔥 update UI instantly
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    // 🔥 update navbar count
    fetchCartCount();

  } catch (err) {
    console.error("Update error:", err);
  }
};
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user"))?.token
    );
  };

  // ✅ FETCH CART
const fetchCart = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user"))?.token;

    console.log("TOKEN:", token);

    const res = await axios.get(
      "https://localhost:7096/api/Cart/GetCartItems",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("FULL RESPONSE:", res.data);

    // 🔥 STEP 1: extract items safely
    let items = [];

    if (Array.isArray(res.data)) {
      items = res.data;
    } else if (Array.isArray(res.data.data)) {
      items = res.data.data;
    } else if (Array.isArray(res.data.data?.items)) {
      items = res.data.data.items;
    }

    console.log("EXTRACTED ITEMS:", items);

    // 🔥 STEP 2: map safely
    const formatted = items.map((item) => ({
      id: item.productId || item.id,
      name: item.productName || item.name,
      price: item.price || 0,
      quantity: item.quantity || 1,
      images: item.thumbnail
        ? [item.thumbnail]
        : item.images || [],
      description: item.description || "",
    }));

    console.log("FORMATTED:", formatted);

    setCartItems(formatted);
  } catch (err) {
    console.error("Cart fetch error:", err);
  } finally {
    setLoading(false);
  }
};

  // ✅ REMOVE ITEM
  const removeFromCart = async (productId) => {
    try {
      const token = getToken();

      await axios.delete(
        `https://localhost:7096/api/Cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // 🔥 update UI instantly
      setCartItems((prev) =>
        prev.filter((item) => item.id !== productId)
      );
      fetchCartCount();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ LOADING
  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  // ✅ EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-2 rounded-full"
        >
          Back to Products
        </button>
        <p>Your cart is empty 🛒</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/products")}
          className="inline-block bg-black text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition"
        >
          Back to Products
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">PRODUCT</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder-image.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description || "No description available"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2 relative">
                         <button
  onClick={() =>
    updateQuantity(item.id, item.quantity - 1)
  }
  disabled={item.quantity <= 1}
  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md"
>
  -
</button>

<span className="px-3 text-gray-700 font-medium">
  {item.quantity}
</span>

<button
  onClick={() =>
    updateQuantity(item.id, item.quantity + 1)
  }
  disabled={item.quantity >= 10}
  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md"
>
  +
</button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={updating[item.id]}
                          className="text-red-600 hover:text-red-700 font-medium text-sm transition"
                        >
                          Remove item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">ORDER SUMMARY</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">TOTAL</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate("/payment")}
                className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-800 transition mt-6"
              >
                Proceed to Checkout
              </ button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
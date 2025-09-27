import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

const Wishlist = () => {
  const { user, setUser } = useContext(AuthContext); 
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!user || !user.wishlist) return;
        setWishlistItems(user.wishlist);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter((item) => item.id !== productId);
      await axios.put(`http://localhost:3001/users/${user.id}`, {
        ...user,
        wishlist: updatedWishlist,
      });
      setWishlistItems(updatedWishlist);
      setUser({ ...user, wishlist: updatedWishlist });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, wishlist: updatedWishlist })
      );
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const addToCart = async (product) => {
    try {
      let updatedCart = user.cart || [];
      const existingItem = updatedCart.find((item) => item.id === product.id);

      if (existingItem) {
        updatedCart = updatedCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...updatedCart, { ...product, quantity: 1 }];
      }

      await axios.put(`http://localhost:3001/users/${user.id}`, {
        ...user,
        cart: updatedCart,
      });

      const updatedUser = { ...user, cart: updatedCart };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const isInCart = (productId) => {
    return user?.cart?.some((item) => item.id === productId);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );

  if (!wishlistItems.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Your wishlist is empty ❤️</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">My Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full relative"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.count > 0 ? `${product.count} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isInCart(product.id) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/cart");
                      }}
                      className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

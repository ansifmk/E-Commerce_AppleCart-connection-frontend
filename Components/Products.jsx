import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()); 
    const matchCategory = category ? p.category === category : true;
    let matchPrice = true;

    if (price) {
      const [min, max] = price.split("-").map(Number);
      matchPrice = max ? p.price >= min && p.price <= max : p.price >= min;
    }

    return matchSearch && matchCategory && matchPrice;
  });

  const toggleWishlist = async (product, e) => {
    e.stopPropagation();
    if (!user) return toast.info("Please login first");

    const isInWishlist = user.wishlist?.some((i) => i.id === product.id);
    const updatedWishlist = isInWishlist
      ? user.wishlist.filter((i) => i.id !== product.id)
      : [...(user.wishlist || []), product];

    await axios.patch(`http://localhost:3001/users/${user.id}`, {
      wishlist: updatedWishlist,
    });

    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast[isInWishlist ? "warning" : "success"](
      `${product.name} ${isInWishlist ? "removed" : "added"} from wishlist`
    );
  };

const addToCart = async (product, e) => {
  e.stopPropagation();
  if (!user) return toast.info("Please login first");
  if (product.count === 0) return toast.warning("Out of stock");

  const cartItemIndex = user.cart?.findIndex((i) => i.id === product.id);
  let updatedCart = [];

  if (cartItemIndex >= 0) {
    updatedCart = [...user.cart];
    updatedCart[cartItemIndex].quantity += 1;
  } else {
    updatedCart = [...(user.cart || []), { ...product, quantity: 1 }];
  }

  await axios.patch(`http://localhost:3001/users/${user.id}`, {
    cart: updatedCart,
  });

  const updatedUser = { ...user, cart: updatedCart };
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));

  toast.success(`${product.name} added to cart`);
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <section
        className="bg-white py-16 shadow-sm relative"
        style={{
          backgroundImage: "url('/hero_endframe__xdzisdq1ppem_xlarge_2x.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              All Products
            </h1>
            <p className="text-lg text-gray-600">
              Explore our complete range of Apple products
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {filtered.length} products available
            </p>

            <div className="w-full max-w-2xl mx-auto mt-8">
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full px-4 py-3 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex justify-center mt-6 gap-4 flex-wrap">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Smartphone">iPhone</option>
                <option value="Laptop">MacBook</option>
                <option value="Smartwatch">Apple Watch</option>
                <option value="Earbuds">AirPods</option>
                <option value="Headphones">AirPods Max</option>
              </select>

              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                <option value="0-50000">₹0 - ₹50,000</option>
                <option value="50001-100000">₹50,001 - ₹1,00,000</option>
                <option value="100001-150000">₹1,00,001 - ₹1,50,000</option>
                <option value="150001">₹1,50,001+</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
              {(category || price || search) && (
                <button
                  onClick={() => {
                    setCategory("");
                    setPrice("");
                    setSearch("");
                  }}
                  className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const isInWishlist = user?.wishlist?.some(
                  (item) => item.id === product.id
                );
                const isInCart = user?.cart?.some(
                  (item) => item.id === product.id
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col relative"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white shadow z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${
                          isInWishlist
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={product.images?.[0] || "/placeholder-image.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {product.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {product.count > 0
                                ? `${product.count} in stock`
                                : "Out of stock"}
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

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInCart) {
                              navigate("/cart");
                            } else {
                              addToCart(product, e);
                            }
                          }}
                          disabled={product.count === 0}
                          className={`w-full py-2.5 px-4 rounded-full text-sm font-medium transition-colors ${
                            product.count === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : isInCart
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          {isInCart ? "Go to Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;

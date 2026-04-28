import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cartIds, setCartIds] = useState([]);
  // const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();
  const { user, setUser, fetchCartCount, wishlistIds, setWishlistIds } =useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [pageNumber, setPageNumber] = useState(pageFromUrl);
const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    setSearchParams({ page: pageNumber });
  }, [pageNumber]);
  const pageSize = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, search, category, price]); // 🔥 added dependencies
  const fetchCartIds = async () => {
    try {
      const res = await axios.get("/api/Cart/GetCartItems");

const items = res.data?.data?.items || [];

setProducts(
  items.map((item) => ({
    ...item,
    name: item.title,
    images: [item.thumbnail],
    count: item.stock,
  }))
);

// 🔥 IMPORTANT LOGIC
setHasMore(items.length === pageSize);
      setCartIds(items.map((i) => i.productId));
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };
  useEffect(() => {
    fetchCartIds();
  }, []);
 const fetchProducts = async () => {
  try {
    setLoading(true);

    // current page
    const res = await axios.get("/api/Products/GetproductsCombined", {
      params: { pageNumber, pageSize, search, category, sortBy: price },
    });

    const items = res.data?.data?.items || [];

    setProducts(
      items.map((item) => ({
        ...item,
        name: item.title,
        images: [item.thumbnail],
        count: item.stock,
      }))
    );

    // 🔥 CHECK NEXT PAGE
    const nextRes = await axios.get("/api/Products/GetproductsCombined", {
      params: { pageNumber: pageNumber + 1, pageSize, search, category, sortBy: price },
    });

    const nextItems = nextRes.data?.data?.items || [];

    setHasMore(nextItems.length > 0); // ✅ ONLY if next page has data

  } catch (err) {
    console.error(err);
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  const fetchWishlistIds = async () => {
    try {
      const res = await axios.get("/api/WishList");

      const items = res.data?.data || [];

      setWishlistIds(items.map((i) => i.productId));
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, []);
  const toggleWishlist = async (productId) => {
    if (!user) return toast.info("Please login first");

    const isAlreadyInWishlist = wishlistIds.includes(productId);

    try {
      await axios.post(`/api/WishList/${productId}`);

      // ✅ Update UI instantly
      setWishlistIds((prev) =>
        isAlreadyInWishlist
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );

      // 🔥 Show correct toast
      toast[isAlreadyInWishlist ? "warning" : "success"](
        isAlreadyInWishlist
          ? "Removed from wishlist 💔"
          : "Added to wishlist ❤️",
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const addToCart = async (product, e) => {
    e.stopPropagation();

    if (!user) return toast.info("Please login first");
    if (product.count === 0) return toast.warning("Out of stock");

    try {
      const res = await axios.post("/api/Cart/add", {
        productId: product.id,
        Quantity: 1,
      });

      // 🔥 FIX START (VERY IMPORTANT)
      setCartIds((prev) => [...prev, product.id]); // update button instantly
      fetchCartCount(); // update navbar instantly
      // 🔥 FIX END

      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
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
              {products.length} products available
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
                <option value="priceAsc">Low to High</option>
                <option value="priceDesc">High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {products.length === 0 ? (
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
              {products.map((product) => {
                const isInWishlist = wishlistIds.includes(product.id);
                const isInCart = cartIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col relative"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ stop card click
                        e.preventDefault(); // ✅ prevent navigation
                        toggleWishlist(product.id); // ✅ FIXED
                      }}
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
                            e.preventDefault(); // 🔥 ADD THIS

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
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Prev
        </button>

        <span className="px-4 py-2">Page {pageNumber}</span>

     <button
  onClick={() => setPageNumber(pageNumber + 1)}
  disabled={!hasMore}
  className={`px-4 py-2 rounded ${
    hasMore ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  Next
</button>
      </div>
    </div>
  );
};

export default Products;

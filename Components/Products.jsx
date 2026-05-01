import React, { useEffect, useState, useContext, useRef } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [cartIds, setCartIds] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();
  const { user, fetchCartCount, wishlistIds, setWishlistIds } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [pageNumber, setPageNumber] = useState(pageFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pageSize = 12;
  const ROW_SIZE = 4;

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Smartphone", label: "iPhone" },
    { value: "Laptop", label: "MacBook" },
    { value: "Smartwatch", label: "Apple Watch" },
    { value: "Earbuds", label: "AirPods" },
    { value: "Headphones", label: "AirPods Max" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearchParams({ page: pageNumber });
  }, [pageNumber]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, debouncedSearch, selectedCategory, sortBy]);

  const fetchCartIds = async () => {
    try {
      const res = await axios.get("/api/Cart/GetCartItems");
      const items = res.data?.data?.items || [];
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
      const res = await axios.get("/api/Products/GetproductsCombined", {
        params: { pageNumber, pageSize, search: debouncedSearch, category: selectedCategory, sortBy },
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
      const nextRes = await axios.get("/api/Products/GetproductsCombined", {
        params: { pageNumber: pageNumber + 1, pageSize, search: debouncedSearch, category: selectedCategory, sortBy },
      });
      const nextItems = nextRes.data?.data?.items || [];
      setHasMore(nextItems.length > 0);
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
      setWishlistIds((prev) =>
        isAlreadyInWishlist ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
      toast[isAlreadyInWishlist ? "warning" : "success"](
        isAlreadyInWishlist ? "Removed from wishlist 💔" : "Added to wishlist ❤️"
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
      await axios.post("/api/Cart/add", { productId: product.id, Quantity: 1 });
      setCartIds((prev) => [...prev, product.id]);
      fetchCartCount();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSortBy("");
    setSearch("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rows = [];
  for (let i = 0; i < products.length; i += ROW_SIZE) {
    rows.push(products.slice(i, i + ROW_SIZE));
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  const ProductCard = ({ product, index }) => {
    const isInWishlist = wishlistIds.includes(product.id);
    const isInCart = cartIds.includes(product.id);

    return (
      <div
        className="flex-shrink-0 w-[280px] md:w-auto snap-start transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 group cursor-pointer flex flex-col relative h-full overflow-hidden border border-gray-100">
          {/* Only "Sold Out" badge – "New" badge removed */}
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            {product.count === 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md z-20 transition-transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-colors ${isInWishlist ? "text-red-500 fill-current" : "text-gray-500"}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <div className="p-4 flex-1 flex flex-col">
            <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
              <img
                src={product.images?.[0] || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.count > 0 ? `${product.count} left` : "Out"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <p className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInCart) navigate("/cart");
                  else addToCart(product, e);
                }}
                disabled={product.count === 0}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all transform active:scale-95 ${
                  product.count === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isInCart
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                }`}
              >
                {isInCart ? "Go to Cart →" : "Add to Cart +"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: isMobile ? "none" : "url('/hero_endframe__xdzisdq1ppem_xlarge_2x.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isMobile ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50"></div>
        ) : (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-2">
            All Products
          </h1>
          <p className="text-gray-600 text-md md:text-lg mb-1">Discover the latest Apple technology</p>
          <p className="text-sm text-gray-400 mb-6">{products.length} premium products available</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 px-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for iPhone, MacBook, Apple Watch..."
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-black-400 transition-all text-sm md:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Chips + Sort Row */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black-400 cursor-pointer text-sm"
              >
                <option value="">Sort by Price</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              {(selectedCategory || sortBy || search) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition shadow-sm text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 mt-4">No products match your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-800 transition shadow-md"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal scroll rows - scrollbar hidden */}
              <div className="block md:hidden space-y-8">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <div className="overflow-x-auto overflow-y-visible pb-3 -mx-4 px-4 hide-scrollbar">
                      <div className="flex gap-5 snap-x snap-mandatory">
                        {row.map((product, idx) => (
                          <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {products.map((product, idx) => (
                  <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 30}ms` }}>
                    <ProductCard product={product} index={idx} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="flex justify-center mt-16 gap-3">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                ← Previous
              </button>
              <span className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-md font-semibold text-sm">
                Page {pageNumber}
              </span>
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={!hasMore}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all transform hover:scale-110 z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Products;
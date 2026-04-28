import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartIds, setCartIds] = useState([]);
  const navigate = useNavigate();
  const { user, fetchCartCount, wishlistIds, setWishlistIds } =  useContext(AuthContext);

  useEffect(() => {
    axios
      .get("https://localhost:7096/api/Products/GetAllItems")
      .then((res) => {
        const products = res.data.data || [];

        // ✅ find product by id
        const selectedProduct = products.find((p) => p.id === parseInt(id));

        if (!selectedProduct) {
          setError("Product not found.");
        } else {
          setProduct(selectedProduct);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Product not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const fetchCartIds = async () => {
      try {
        const res = await axios.get("/api/Cart/GetCartItems");
        const items = res.data?.data?.items || [];
        setCartIds(items.map((i) => i.productId));
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    fetchCartIds();
  }, []);
  const addToCart = async () => {
    if (!user) return toast.info("Please login first");
    if (!product) return;
    if (product.stock === 0) return toast.warning("Out of stock");

    try {
      await axios.post("/api/Cart/add", {
        productId: product.id,
        Quantity: 1,
      });

      setCartIds((prev) => [...prev, product.id]); // ✅ ADD THIS
      fetchCartCount();

      toast.success(`${product.title} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };
  const toggleWishlist = async () => {
    if (!user) return toast.info("Please login to use wishlist");
    if (!product) return;

    const isInWishlist = wishlistIds.includes(product.id);

    try {
      await axios.post(`/api/WishList/${product.id}`);

      // ✅ update context state
      setWishlistIds((prev) =>
        isInWishlist
          ? prev.filter((id) => id !== product.id)
          : [...prev, product.id],
      );

      // ✅ YOUR SAME TOAST LOGIC (kept)
      toast[isInWishlist ? "warning" : "success"](
        isInWishlist
          ? `${product.title} removed from wishlist`
          : `${product.title} added to wishlist`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist. Please try again.");
    }
  };
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return null;

  const isInWishlist = wishlistIds.includes(product.id);
  const isInCart = cartIds.includes(product.id);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="rounded-lg max-h-96 object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-2xl font-bold mb-2">
            ₹{product.price ? product.price.toLocaleString() : "N/A"}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex space-x-4">
            {isInCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`px-6 py-3 rounded-lg font-medium ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            )}

            <button
              onClick={toggleWishlist}
              className={`px-6 py-3 rounded-lg font-medium ${
                isInWishlist
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist ♡"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

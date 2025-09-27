import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HighlightProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/products");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const productsArray = data.products || data;
      const highlightProducts = productsArray.filter((p) => p.highlight === true);
      setProducts(highlightProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load highlight products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading highlight products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Highlighted Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our top featured Apple products
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {products.length} highlighted products available
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No highlighted products available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                            {product.category}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HighlightProducts;

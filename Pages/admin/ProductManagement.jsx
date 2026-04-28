import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Pencil, Trash2, Plus, Search, X, Filter, Package, TrendingUp, AlertTriangle, CheckCircle, AlertCircle, Edit, ShoppingBag, Trash, Ban } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom toast configurations
const toastConfig = {
  success: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
  },
  error: {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
  },
  add: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #00ff37 0%, #01ff51 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
  },
  update: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #3a00f7 0%, #0008ff 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
  },
  delete: {
    position: "bottom-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    style: {
      background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
      color: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #ef4444",
      fontWeight: "600",
      fontSize: "14px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      padding: "14px 20px",
      letterSpacing: "0.3px",
    },
    progressStyle: { background: "#ffffff", height: "4px" },
  },
  warning: {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
  },
};

const ProductManagement = ({ isDark = true }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Theme-based classes
  const bgClass = isDark ? "bg-gradient-to-br from-gray-100 via-white to-gray-100" : "bg-gradient-to-br from-gray-900 via-black to-gray-900";
  const cardBgClass = isDark ? "bg-white" : "bg-white/5";
  const borderClass = isDark ? "border-gray-200" : "border-white/20";
  const textPrimaryClass = isDark ? "text-gray-900" : "text-white";
  const textSecondaryClass = isDark ? "text-gray-500" : "text-gray-400";
  const inputBgClass = isDark ? "bg-gray-50" : "bg-black/50";
  const inputBorderClass = isDark ? "border-gray-200" : "border-gray-700";
  const tableHeaderBgClass = isDark ? "bg-gray-100" : "bg-black/90";

  const fetchCategories = async () => {
    const res = await axios.get("/GetAllCategories");
    const cats = res.data.data || res.data;
    setCategories(Array.isArray(cats) ? cats : []);
    return cats;
  };

  const handleEdit = (p) => {
    setShowModal(true);
    setIsEdit(true);
    setEditId(p.id);
    setTitle(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setBrand(p.brand || "");
    setDescription(p.description || "");
    setSelectedCategoryId(p.categoryId);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Products/GetAllItems");
      const items = res.data.data || res.data;
      const cats = await fetchCategories();

      const mapped = items.map((p) => {
        const cat = cats.find((c) => Number(c.id) === Number(p.categoryId));
        return {
          id: p.id,
          name: p.title,
          category: cat?.name || "No Category",
          price: p.price,
          stock: p.stock,
          image: p.thumbnail,
          brand: p.brand,
          description: p.description,
          categoryId: p.categoryId,
        };
      });

      setProducts(mapped);
      setAllProducts(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products", toastConfig.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!title.trim()) {
      toast.error("Product title required");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select category");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Price", price);
      formData.append("Stock", stock);
      formData.append("Brand", brand);
      formData.append("Description", description);
      formData.append("CategoryID", selectedCategoryId);
      for (let i = 0; i < images.length; i++) {
        formData.append("ImageFiles", images[i]);
      }
      await axios.post("/api/Products/Addproduct", formData);
      toast.success("Product added successfully");
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allProducts];
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    setProducts(filtered);
  }, [search, selectedCategory, allProducts]);

  const handleUpdateProduct = async () => {
    if (!price || Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Price", price);
      formData.append("Stock", stock);
      formData.append("Brand", brand);
      formData.append("Description", description);
      formData.append("CategoryID", selectedCategoryId);
      for (let i = 0; i < images.length; i++) {
        formData.append("ImageFiles", images[i]);
      }
      await axios.put(`/api/Products/Update/${editId}`, formData);
      toast(<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Edit className="w-4 h-4 text-white" /></div><div><p className="font-semibold text-white text-sm">Product Updated</p><p className="text-white/80 text-xs">{title} has been updated successfully</p></div></div>, toastConfig.update);
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to update product", toastConfig.error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const productToDelete = products.find(p => p.id === id);
    const confirmDelete = window.confirm(`Are you sure you want to delete ${productToDelete?.name}?`);
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await axios.patch(`/api/Products/Delete/${id}`);
      toast(<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Trash className="w-4 h-4 text-white" /></div><div><p className="font-semibold text-white text-sm">Product Deleted</p><p className="text-white/80 text-xs">{productToDelete?.name} has been removed permanently</p></div></div>, toastConfig.delete);
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to delete product", toastConfig.error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setStock("");
    setBrand("");
    setDescription("");
    setSelectedCategoryId("");
    setImages([]);
    setIsEdit(false);
    setEditId(null);
  };

  const totalInventoryValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = allProducts.filter((p) => p.stock < 5).length;

  if (loading && allProducts.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-100" : "bg-black"} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-gray-600" : "border-white"} mx-auto mb-4`}></div>
          <p className={isDark ? "text-gray-600" : "text-white"}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${isDark ? "from-gray-800 to-gray-500" : "from-white to-gray-400"} bg-clip-text text-transparent`}>
            Product Management
          </h1>
          <p className={`${textSecondaryClass} mt-2`}>Manage all products and inventory</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard icon={<Package className="w-6 h-6" />} label="Total Products" value={allProducts.length} isDark={isDark} />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Inventory Value" value={`₹${totalInventoryValue.toLocaleString()}`} isDark={isDark} />
          <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Low Stock (< 5)" value={lowStockCount} alert={lowStockCount > 0} isDark={isDark} />
        </div>

        {/* SEARCH + FILTERS */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 border ${borderClass}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={18} />
              <input type="text" placeholder="Search products by name..." className={`w-full pl-10 pr-4 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:min-w-[200px]">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={16} />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={`w-full pl-9 pr-8 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} appearance-none cursor-pointer focus:outline-none focus:border-white transition-colors`}>
                  <option value="">All Categories</option>
                  {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                </select>
              </div>
              <button onClick={() => { setShowModal(true); setIsEdit(false); resetForm(); }} className={`inline-flex items-center gap-2 px-5 py-2.5 ${isDark ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"} rounded-xl transition-all duration-200 font-medium`}>
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl border ${borderClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className={`sticky top-0 ${tableHeaderBgClass} backdrop-blur-lg border-b ${borderClass}`}>
                  <tr className={`text-xs uppercase tracking-wider ${textSecondaryClass}`}>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left hidden sm:table-cell">Category</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-100" : "divide-white/10"}`}>
                  {products.map((p) => (
                    <tr key={p.id} className={`hover:${isDark ? "bg-gray-50" : "bg-white/5"} transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-800" alt={p.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x40?text=No+Image'; }} />
                          <span className={`font-medium ${textPrimaryClass}`}>{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`inline-flex px-3 py-1 ${isDark ? "bg-gray-100 text-gray-700" : "bg-white/10 text-gray-300"} rounded-full text-xs font-medium`}>
                          {p.category}
                        </span>
                      </td>
                      <td className={`p-4 font-semibold ${textPrimaryClass}`}>₹{p.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${p.stock < 5 ? (isDark ? "bg-red-100 text-red-700 border border-red-200" : "bg-red-900/50 text-red-300 border border-red-700") : (isDark ? "bg-green-100 text-green-700 border border-green-200" : "bg-green-900/50 text-green-300 border border-green-700")}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleEdit(p)} className={`p-1.5 ${textSecondaryClass} hover:${textPrimaryClass} transition-colors`} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className={`w-16 h-16 ${isDark ? "text-gray-300" : "text-gray-600"} mx-auto mb-4`} />
              <p className={`text-lg ${textSecondaryClass}`}>No Products Found</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>Try adjusting your search or add a new product</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`bg-gradient-to-br ${isDark ? "from-gray-100 to-white" : "from-gray-900 to-black"} rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border ${borderClass} shadow-2xl`}>
            <div className={`sticky top-0 ${isDark ? "bg-white" : "bg-black/90"} backdrop-blur-lg border-b ${borderClass} p-6 flex justify-between items-center`}>
              <div>
                <h2 className={`text-2xl font-bold ${textPrimaryClass}`}>{isEdit ? "Update Product" : "Add New Product"}</h2>
                <p className={`${textSecondaryClass} text-sm mt-1`}>{isEdit ? "Modify product details" : "Fill in product information"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 hover:${isDark ? "bg-gray-100" : "bg-white/10"} rounded-xl transition-colors`}>
                <X className={`w-5 h-5 ${textSecondaryClass}`} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Product Title</label>
                  <input placeholder="Enter product title" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Price (₹)</label>
                  <input type="number" min="1" placeholder="Enter price" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Stock Quantity</label>
                  <input type="number" min="0" placeholder="Enter stock" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Brand</label>
                  <input placeholder="Enter brand name" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Category</label>
                  <select className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} focus:outline-none focus:border-white transition-colors cursor-pointer`} value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Description</label>
                  <textarea rows="3" placeholder="Enter product description" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-700" : "text-gray-300"} mb-2`}>Product Images</label>
                  <input type="file" multiple accept="image/*" className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-xl p-3 text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer focus:outline-none focus:border-white transition-colors`} onChange={(e) => setImages(Array.from(e.target.files))} />
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>You can select multiple images</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t ${borderClass}">
                <button onClick={() => setShowModal(false)} className={`px-5 py-2.5 ${isDark ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/10 text-white hover:bg-white/20"} rounded-xl transition-all duration-200 font-medium`}>
                  Cancel
                </button>
                <button onClick={isEdit ? handleUpdateProduct : handleAddProduct} disabled={loading} className={`px-5 py-2.5 ${isDark ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"} rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {loading ? "Processing..." : (isEdit ? "Update Product" : "Add Product")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// STAT CARD COMPONENT
const StatCard = ({ icon, label, value, alert = false, isDark }) => (
  <div className={`group ${isDark ? "bg-white" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-gray-200" : "border-white/20"} hover:border-white/40 transition-all duration-300 hover:scale-105`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
        <p className={`text-2xl sm:text-3xl font-bold mt-2 ${alert ? "text-red-400" : (isDark ? "text-gray-900" : "text-white")}`}>{value}</p>
      </div>
      <div className={`${isDark ? "text-gray-400 group-hover:text-gray-600" : "text-gray-400 group-hover:text-white"} transition-colors`}>{icon}</div>
    </div>
  </div>
);

export default ProductManagement;
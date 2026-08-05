import React, { useEffect, useState, useMemo } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Download,
  Search,
} from "lucide-react";
import ProductForm from "./ProductForm";
import { exportToCSV } from "@/utils/exportCsv";

const ProductManagement: React.FC = () => {
  const { products, fetchProducts, deleteProduct, isLoading } = useAdminStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayedProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleExportCSV = () => {
    if (!displayedProducts || displayedProducts.length === 0) return;

    const headers = [
      "Product ID",
      "Name",
      "Category",
      "Price (INR)",
      "Original Price (INR)",
      "Rating",
      "Reviews Count",
      "Status",
      "Short Description",
    ];

    const rows = displayedProducts.map((p) => [
      p._id,
      p.name || "N/A",
      p.category || "General",
      p.price || 0,
      p.originalPrice || "",
      p.rating || 5,
      p.reviewCount || 0,
      p.onHold ? "On Hold" : "Available",
      p.shortDescription || p.description || "",
    ]);

    const filename = `products_export_${new Date().toISOString().split("T")[0]}.csv`;
    exportToCSV(filename, headers, rows);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  if (isLoading && products.length === 0)
    return <div className="p-8 text-center text-xl">Loading products...</div>;

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Product Management
            <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-2.5 py-1 rounded-full border border-yellow-200">
              {displayedProducts.length} Products
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your catalog items, pricing, inventory status & export list.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={displayedProducts.length === 0}
            className="bg-[#2C5530] hover:bg-[#1a3a20] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            onClick={handleAddNew}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md text-left">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-yellow-500 outline-none shadow-2xs"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product._id}
            className="product-card group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full relative shadow-sm hover:shadow-md transition-all"
          >
            {/* Admin Action Buttons */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-blue-600 transition-all duration-300 active:scale-90"
                title="Edit Product"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-red-600 transition-all duration-300 active:scale-90"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Image Container */}
            <div className="block relative w-full h-48 overflow-hidden bg-[#FAF7F2]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}

              {/* On Hold Badge */}
              {product.onHold && (
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                    On Hold
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow text-left">
              <h3
                className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#C9A961] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h3>

              <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-[#C9A961]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (product.rating || 5)
                          ? "fill-current"
                          : "fill-gray-200"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-bold">
                  ({product.reviewCount || 0})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base font-black text-[#2C5530]">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Edit Button */}
              <div className="mt-auto">
                <button
                  onClick={() => handleEdit(product)}
                  className="w-full bg-[#FAF7F2] hover:bg-[#2C5530] hover:text-white border border-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-all duration-300"
                >
                  Edit Product Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedProducts.length === 0 && (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Products Found
          </h3>
          <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
            Ready to start your artisan cheese journey? Add your first product.
          </p>
          <button
            onClick={handleAddNew}
            className="text-yellow-600 font-bold text-xs hover:underline"
          >
            Create Product Now
          </button>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;

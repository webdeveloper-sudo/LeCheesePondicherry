import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import ProductForm from "./ProductForm";

const ProductManagement: React.FC = () => {
  const { products, fetchProducts, deleteProduct, isLoading } = useAdminStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management <span className="bg-gray-300 rounded-full px-2 py-1">{products.length}</span></h2>
        <button
          onClick={handleAddNew}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card group bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full relative"
          >
            {/* Admin Action Buttons (Replacing Heart) */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-blue-600 transition-all duration-300 active:scale-90"
                title="Edit Product"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-red-600 transition-all duration-300 active:scale-90"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Image Container (Exact Match) */}
            <div className="block relative w-full h-full overflow-hidden bg-[#FAF7F2]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
              {/* Quick View Overlay */}
              {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleEdit(product)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#1A1A1A] px-4 py-2 rounded-md text-sm font-medium shadow-lg"
                >
                  Quick Edit
                </button>
              </div> */}
            </div>

            {/* Content (Exact Match) */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Product Name */}
              <h3
                className="text-lg font-medium text-[#1A1A1A] mb-1 hover:text-[#C9A961] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#6B6B6B] mb-2 line-clamp-2">
                {product.shortDescription || product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-[#C9A961]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < (product.rating || 5) ? "fill-current" : "fill-gray-300"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[#6B6B6B]">
                  ({product.reviews || 0})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-semibold text-[#2C5530]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#6B6B6B] line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Add to Cart Button - pushed to bottom with mt-auto */}
              <div className="mt-auto">
                <button
                  onClick={() => handleEdit(product)}
                  className="w-full btn btn-secondary text-sm py-2 hover:bg-[#C9A961] hover:text-white hover:border-[#C9A961] transition-all duration-300"
                >
                  Edit Product Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Products Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            Ready to start your artisan cheese journey? Add your first product
            to showcase it to the world.
          </p>
          <button
            onClick={handleAddNew}
            className="text-yellow-600 font-bold hover:underline"
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

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { X, Upload, Trash2, Plus } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const {
    createProduct,
    updateProduct,
    isLoading,
    error: storeError,
  } = useAdminStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    originalPrice: 0,
    category: "aged",
    weight: "",
    inStock: true,
    featured: false,
    ingredients: "",
  });

  const [tastingNotes, setTastingNotes] = useState({
    appearance: "",
    texture: "",
    aroma: "",
    flavor: "",
    finish: "",
  });

  const [images, setImages] = useState<any[]>([]); // { name, mimeType, data (base64) }
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category || "aged",
        weight: product.weight || "",
        inStock: product.inStock ?? true,
        featured: product.featured ?? false,
        ingredients: product.ingredients || "",
      });
      if (product.tastingNotes) {
        setTastingNotes({ ...product.tastingNotes });
      }
      if (product.images && Array.isArray(product.images)) {
        // Ensure we show all images, including the main one if it's not in the list
        const allImages = [...product.images];
        if (product.image && !allImages.includes(product.image)) {
          allImages.unshift(product.image);
        }
        setExistingImages(allImages);
      } else if (product.image) {
        setExistingImages([product.image]);
      }
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleTastingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTastingNotes((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                mimeType: file.type,
                data: (reader.result as string).split(",")[1], // Get base64 without prefix
                preview: reader.result as string, // For UI preview
              });
            };
            reader.readAsDataURL(file);
          });
        }),
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Submitting product form...");
    setLocalError(null);

    try {
      const submissionData = {
        ...formData,
        tastingNotes,
        imagesBase64: images.map((img) => ({
          name: img.name,
          mimeType: img.mimeType,
          data: img.data,
        })),
        images: existingImages, // Existing URLs to keep
      };

      console.log("📦 Submission Data details (excluding base64):", {
        name: submissionData.name,
        imageCount: submissionData.imagesBase64.length,
        existingImageCount: submissionData.images.length,
      });

      let success = false;
      if (product) {
        success = await updateProduct(product._id, submissionData);
      } else {
        success = await createProduct(submissionData);
      }

      if (success) {
        console.log("✅ Product operation successful!");
        onClose();
      } else {
        console.log("❌ Product operation failed according to store");
      }
    } catch (err: any) {
      console.error("🔥 Crash in handleSubmit:", err);
      setLocalError(
        err.message || "An unexpected error occurred during submission",
      );
    }
  };

  const loadTestData = () => {
    setFormData({
      name: "Gourmet Brie " + Math.floor(Math.random() * 1000),
      description:
        "A rich, creamy brie with a buttery flavor and a hint of mushroom. Perfect for any cheese board.",
      shortDescription: "Creamy, buttery French-style brie cheese.",
      price: 450,
      originalPrice: 550,
      category: "fresh",
      weight: "200g",
      inStock: true,
      featured: true,
      ingredients: "Cow Milk, Salt, Culture, Rennet",
    });
    setTastingNotes({
      appearance: "Creamy white rind",
      texture: "Soft and gooey",
      aroma: "Earthy and milky",
      flavor: "Buttery and mild",
      finish: "Smooth",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button
              onClick={loadTestData}
              className="px-3 py-1.5 text-xs font-bold bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors border border-purple-100"
            >
              Load Test Data
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {(localError || storeError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="p-1 bg-red-100 rounded-full flex-shrink-0">
                <X size={16} className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Action Failed</p>
                <p className="text-sm opacity-90">{localError || storeError}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                    placeholder="e.g., Baby Swiss"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                      <option value="aged">Aged Cheeses</option>
                      <option value="fresh">Fresh Cheeses</option>
                      <option value="specialty">Specialty Cheeses</option>
                      <option value="melting">Melting & Basics</option>
                      <option value="subscriptions">Subscriptions</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Weight/Unit
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                      placeholder="e.g., 200g"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                      In Stock
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                      Featured
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Column: Descriptions & Images */}
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-all group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer space-y-2"
                    >
                      <div className="p-3 bg-yellow-50 rounded-full text-yellow-600 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        Click to upload or drag images
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {(images.length > 0 || existingImages.length > 0) && (
              <div className="space-y-4 py-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700">
                    Image Previews ({existingImages.length + images.length})
                  </label>
                  <span className="text-xs text-gray-400">
                    First image will be used as primary
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {existingImages.map((img, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        idx === 0
                          ? "border-yellow-500 ring-2 ring-yellow-50"
                          : "border-gray-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-[9px] py-0.5 text-center font-bold uppercase tracking-tighter">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                  {images.map((img, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-yellow-300 ring-2 ring-yellow-50"
                    >
                      <img
                        src={img.preview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-[9px] py-0.5 text-center font-bold uppercase tracking-tighter">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasting Notes */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Tasting Notes (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {Object.keys(tastingNotes).map((note) => (
                  <div key={note} className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {note}
                    </label>
                    <input
                      type="text"
                      name={note}
                      value={(tastingNotes as any)[note]}
                      onChange={handleTastingChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                      placeholder={`e.g., ${note}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-sm font-bold text-gray-700">
                Ingredients
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="e.g., Cow Milk, Culture, Salt..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-yellow-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : product ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

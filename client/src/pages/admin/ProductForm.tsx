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
    ingredients: [] as string[],
    rating: 0,
    reviewCount: 0,
    pairings: "",
    onHold: false,
    bestPairingDishes: [] as any[],
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
        ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        pairings: product.pairings || "",
        onHold: product.onHold ?? false,
        bestPairingDishes: product.bestPairingDishes || [],
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
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
        pairings: formData.pairings || "",
        ingredients: formData.ingredients,
        tastingNotes,
        imagesBase64: images.map((img) => ({
          name: img.name,
          mimeType: img.mimeType,
          data: img.data,
        })),
        images: existingImages, // Existing URLs to keep
        onHold: formData.onHold === true, // Force boolean
        bestPairingDishes: formData.bestPairingDishes,
        reviews: product?.reviews || [], // Read-only from existing product
      };

      console.log("📤 Final submissionData Summary:", { 
        name: submissionData.name, 
        mainImages: submissionData.imagesBase64?.length,
        dishes: submissionData.bestPairingDishes?.length 
      });

      console.log("📤 Final Submission Payload [onHold]:", submissionData.onHold);

      console.log("📤 Sending Product Update:", {
        productId: product?._id,
        onHold: submissionData.onHold,
      });

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
      ingredients: ["Cow Milk", "Salt", "Culture", "Rennet"],
      rating: 4.8,
      reviewCount: 12,
      pairings: "Red Wine, Grapes, Sourdough",
      onHold: false,
      bestPairingDishes: [
        {
          dishName: "Classic Cheese Platter",
          shortDescription: "A selection of artisanal cheeses...",
          originCountry: "France",
          prepTime: "15 mins",
          difficultyLevel: "Easy",
          whyItPairsWell: "The creamy texture complements...",
          ingredients: ["Brie", "Grapes", "Crackers"],
          steps: ["Arrange cheese", "Add fruits", "Serve"]
        }
      ],
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
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="onHold"
                      checked={formData.onHold}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-red-700 group-hover:text-red-900 transition-colors">
                      On Hold (Hidden from Shop)
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

            {/* Rating, Reviews & Pairings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Review Count
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Pairings (comma separated)
                </label>
                <textarea
                  name="pairings"
                  value={formData.pairings}
                  onChange={handleInputChange}
                  placeholder="e.g. Best served with Red Wine, Grapes, and fresh Sourdough bread."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700">
                  Ingredients
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ""] }))}
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Ingredient
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={ing}
                      onChange={(e) => {
                        const newIngs = [...formData.ingredients];
                        newIngs[idx] = e.target.value;
                        setFormData(prev => ({ ...prev, ingredients: newIngs }));
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                      placeholder="Ingredient name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newIngs = formData.ingredients.filter((_, i) => i !== idx);
                        setFormData(prev => ({ ...prev, ingredients: newIngs }));
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {formData.ingredients.length === 0 && (
                <p className="text-xs text-gray-400 italic">No ingredients added yet.</p>
              )}
            </div>

            {/* Best Pairing Dishes Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Best Pairing Dishes</h3>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    bestPairingDishes: [...prev.bestPairingDishes, {
                      dishName: "",
                      shortDescription: "",
                      originCountry: "",
                      prepTime: "",
                      difficultyLevel: "Easy",
                      whyItPairsWell: "",
                      ingredients: [""],
                      steps: [""],
                      image: ""
                    }]
                  }))}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl font-bold hover:bg-yellow-100 transition-all border border-yellow-200"
                >
                  <Plus size={18} /> Add Pairing Dish
                </button>
              </div>

              <div className="space-y-8">
                {formData.bestPairingDishes.map((dish, dishIdx) => (
                  <div key={dishIdx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 relative group/dish animate-in fade-in slide-in-from-top-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        bestPairingDishes: prev.bestPairingDishes.filter((_, i) => i !== dishIdx)
                      }))}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover/dish:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Dish Basic Info */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dish Name</label>
                          <input
                            type="text"
                            value={dish.dishName}
                            onChange={(e) => {
                              const newDishes = [...formData.bestPairingDishes];
                              newDishes[dishIdx].dishName = e.target.value;
                              setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                            placeholder="e.g. Traditional Quiche"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Origin Country</label>
                            <input
                              type="text"
                              value={dish.originCountry}
                              onChange={(e) => {
                                const newDishes = [...formData.bestPairingDishes];
                                newDishes[dishIdx].originCountry = e.target.value;
                                setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              placeholder="e.g. France"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prep Time</label>
                            <input
                              type="text"
                              value={dish.prepTime}
                              onChange={(e) => {
                                const newDishes = [...formData.bestPairingDishes];
                                newDishes[dishIdx].prepTime = e.target.value;
                                setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              placeholder="e.g. 45 mins"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Description</label>
                          <textarea
                            value={dish.shortDescription}
                            onChange={(e) => {
                              const newDishes = [...formData.bestPairingDishes];
                              newDishes[dishIdx].shortDescription = e.target.value;
                              setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                            }}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none"
                          />
                        </div>
                      </div>

                      {/* Dish Image & Complexity */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dish Image</label>
                          <div className="flex gap-4 items-start">
                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative flex-shrink-0">
                              {dish.image || dish.imagePreview ? (
                                <img src={dish.imagePreview || dish.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Upload size={24} />
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newDishes = [...formData.bestPairingDishes];
                                      newDishes[dishIdx].data = reader.result as string; 
                                      newDishes[dishIdx].imageMimeType = file.type;
                                      newDishes[dishIdx].imagePreview = reader.result as string;
                                      setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Difficulty</label>
                              <select
                                value={dish.difficultyLevel}
                                onChange={(e) => {
                                  const newDishes = [...formData.bestPairingDishes];
                                  newDishes[dishIdx].difficultyLevel = e.target.value;
                                  setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Chef Level">Chef Level</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Why it pairs well</label>
                          <textarea
                            value={dish.whyItPairsWell}
                            onChange={(e) => {
                              const newDishes = [...formData.bestPairingDishes];
                              newDishes[dishIdx].whyItPairsWell = e.target.value;
                              setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                            }}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none"
                            placeholder="e.g. The acidity cuts through the richness..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Lists: Ingredients & Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-gray-100">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingredients</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newDishes = [...formData.bestPairingDishes];
                              newDishes[dishIdx].ingredients.push("");
                              setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                            }}
                            className="text-[10px] font-bold text-yellow-600 hover:text-yellow-700"
                          >+ Add Item</button>
                        </div>
                        <div className="space-y-2">
                          {dish.ingredients.map((ing: string, ingIdx: number) => (
                            <div key={ingIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={ing}
                                onChange={(e) => {
                                  const newDishes = [...formData.bestPairingDishes];
                                  newDishes[dishIdx].ingredients[ingIdx] = e.target.value;
                                  setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 outline-none text-xs"
                                placeholder="e.g. 100g Cheese"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newDishes = [...formData.bestPairingDishes];
                                  newDishes[dishIdx].ingredients = newDishes[dishIdx].ingredients.filter((_: any, i: number) => i !== ingIdx);
                                  setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                }}
                                className="text-red-400 hover:text-red-600"
                              ><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Steps</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newDishes = [...formData.bestPairingDishes];
                              newDishes[dishIdx].steps.push("");
                              setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                            }}
                            className="text-[10px] font-bold text-yellow-600 hover:text-yellow-700"
                          >+ Add Step</button>
                        </div>
                        <div className="space-y-2">
                          {dish.steps.map((step: string, stepIdx: number) => (
                            <div key={stepIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => {
                                  const newDishes = [...formData.bestPairingDishes];
                                  newDishes[dishIdx].steps[stepIdx] = e.target.value;
                                  setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 outline-none text-xs"
                                placeholder={`Step ${stepIdx + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newDishes = [...formData.bestPairingDishes];
                                  newDishes[dishIdx].steps = newDishes[dishIdx].steps.filter((_: any, i: number) => i !== stepIdx);
                                  setFormData(prev => ({ ...prev, bestPairingDishes: newDishes }));
                                }}
                                className="text-red-400 hover:text-red-600"
                              ><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.bestPairingDishes.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-4">No pairing dishes added yet.</p>
                )}
              </div>
            </div>

            {/* Read-only Reviews Section */}
            {product && product.reviews && product.reviews.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Customer Reviews (Read-only)</h3>
                <div className="space-y-4">
                  {product.reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="p-4 bg-blue-50/30 rounded-xl border border-blue-100 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {rev.username?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{rev.username || "Anonymous"} <span className="text-xs font-normal text-gray-500">at {rev.restaurantName || "Our Shop"}</span></p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{rev.userArea || "Artisan Selection"}</p>
                          </div>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                               <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                               </svg>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

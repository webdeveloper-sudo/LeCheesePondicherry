import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Trash2, Save, Loader } from "lucide-react";
import axios from "axios";

interface BlogFormProps {
  existingBlog?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlogForm({
  existingBlog,
  onClose,
  onSuccess,
}: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: "",
    quoteText: "",
    quoteAuthor: "",
    isPublished: true,
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title || "",
        excerpt: existingBlog.excerpt || "",
        content: existingBlog.content || "",
        author: existingBlog.author || "",
        category: existingBlog.category || "",
        tags: existingBlog.tags ? existingBlog.tags.join(", ") : "",
        date: existingBlog.date || "",
        readTime: existingBlog.readTime || "",
        quoteText: existingBlog.quote?.text || "",
        quoteAuthor: existingBlog.quote?.author || "",
        isPublished: existingBlog.isPublished !== false,
      });
      setMainImagePreview(existingBlog.image || "");
      if (existingBlog.gallery) {
        setGalleryPreviews(existingBlog.gallery);
      }
    }
  }, [existingBlog]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = JSON.parse(
        localStorage.getItem("lepondy-user-storage") || "{}",
      ).state?.token;

      // Prepare payload
      const payload: any = {
        ...formData,
        quote: {
          text: formData.quoteText,
          author: formData.quoteAuthor,
        },
      };

      // Handle Main Image
      if (mainImage) {
        const base64 = await convertToBase64(mainImage);
        payload.mainImageBase64 = {
          name: mainImage.name,
          mimeType: mainImage.type,
          data: base64.split(",")[1], // Remove prefix
        };
      }

      // Handle Gallery Images
      if (galleryImages.length > 0) {
        const galleryBase64List = await Promise.all(
          galleryImages.map(async (file) => {
            const base64 = await convertToBase64(file);
            return {
              name: file.name,
              mimeType: file.type,
              data: base64.split(",")[1],
            };
          }),
        );
        payload.galleryBase64 = galleryBase64List;
      }

      if (existingBlog) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/blogs/${existingBlog._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {existingBlog ? "Edit Story" : "Create New Story"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Tradition">Tradition</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Recipes">Recipes</option>
                  <option value="News">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Publish Date (String)
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. May 12, 2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Main Image
              </label>
              <div
                onClick={() => mainImageInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-50 transition-all overflow-hidden relative"
              >
                {mainImagePreview ? (
                  <img
                    src={mainImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <Upload size={40} className="text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400 font-medium">
                      Click to upload main image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={mainImageInputRef}
                  className="hidden"
                  onChange={handleMainImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Excerpt (Short Description)
            </label>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content (Markdown Supported)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Use ## for headers, ** for bold.
            </p>
            <textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-mono text-sm leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. Cheese, Aging, Wine"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="e.g. 5 min read"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Quote Section */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
              Featured Quote
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Quote Text
                </label>
                <input
                  type="text"
                  name="quoteText"
                  value={formData.quoteText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Quote Author
                </label>
                <input
                  type="text"
                  name="quoteAuthor"
                  value={formData.quoteAuthor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gallery Section - Simplified for now */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Gallery Images
            </label>
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="w-32 h-32 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-50 transition-all"
              >
                <Plus size={24} className="text-gray-300" />
                <span className="text-xs text-gray-400 mt-1">Add Image</span>
                <input
                  type="file"
                  ref={galleryInputRef}
                  className="hidden"
                  onChange={handleGalleryChange}
                  multiple
                  accept="image/*"
                />
              </div>
              {galleryPreviews.map((src, index) => (
                <div
                  key={index}
                  className="w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={src}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Add remove logic if needed, skipping for brevity */}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-all mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold shadow-lg shadow-yellow-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Story
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

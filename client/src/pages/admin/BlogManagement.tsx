import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader } from "lucide-react";
import BlogForm from "./BlogForm";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  image: string;
  isPublished: boolean;
  slug?: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
      );
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handeDelete = async (id: string) => {
    try {
      const token = JSON.parse(
        localStorage.getItem("lepondy-user-storage") || "{}",
      ).state?.token;
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBlogs();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isFormOpen) {
    return (
      <BlogForm
        existingBlog={editingBlog}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
          fetchBlogs();
        }}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm transition-all"
        >
          <Plus size={20} />
          Add New Story
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search stories..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-yellow-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
              onClick={() => window.open(`/stories/${blog.slug}`, "_blank")}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBlog(blog);
                      setIsFormOpen(true);
                    }}
                    className="p-2 bg-white/90 rounded-full shadow-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(blog._id);
                    }}
                    className="p-2 bg-white/90 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-bold text-white uppercase tracking-wider">
                  {blog.category}
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {blog.date}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    By {blog.author}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${blog.isPublished !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {blog.isPublished !== false ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this story? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handeDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

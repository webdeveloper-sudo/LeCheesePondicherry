import { useParams, Link } from "react-router-dom";
import BlogSidebar from "./components/BlogSidebar";
import heroImage from "@/assets/images/hero-cheese-board.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Loader,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { blogs as staticBlogs } from "@/data/blogs";

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  tags: string[];
  gallery?: string[];
  quote?: {
    text: string;
    author: string;
  };
}

export default function SingleBlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]); // To find prev/next

  useEffect(() => {
    // Map static blogs to the expected Blog interface
    const mappedBlogs = staticBlogs.map((b) => ({
      _id: b.id,
      id: b.id,
      title: b.title,
      slug: b.id,
      content: b.content,
      image: b.image,
      category: b.category,
      date: b.date,
      author: b.author,
      tags: b.tags,
      gallery: b.gallery,
      quote: b.quote,
    }));

    setAllBlogs(mappedBlogs);

    // Find the specific blog by slug (which is id in static data)
    const currentBlog = mappedBlogs.find((b) => b.slug === slug);
    if (currentBlog) {
      setBlog(currentBlog);
    }
    setLoading(false);
  }, [slug]);

  /* Commenting out backend fetch logic
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        // Fetch single blog
        const blogRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blogs/${slug}`,
        );
        if (blogRes.data.success) {
          setBlog(blogRes.data.data);
        }

        // Fetch all blogs for navigation (could be optimized to just fetch IDs/slugs)
        const allRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blogs`,
        );
        if (allRes.data.success) {
          setAllBlogs(allRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog details", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);
  */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <Loader className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
        <h1 className="text-4xl font-bold text-[#2C5530] mb-4">
          Story Not Found
        </h1>
        <Link
          to="/stories"
          className="text-[#C9A961] font-bold hover:underline"
        >
          ← Back to Stories
        </Link>
      </div>
    );
  }

  // Prev/Next Navigation Logic
  const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  return (
    <>
      {/* Full-screen pattern background - covers entire body */}
      <div className="fixed inset-0 bg-pattern z-0" />

      <div className="relative z-10 min-h-screen">
        {/* Header / Hero Area - Clean background, sits above pattern */}
        <section className="relative py-24 bg-[#2C5530] overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1.5 bg-[#FAB519] text-[#1D161A] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
              {blog.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#ffffff] max-w-4xl mx-auto mb-8 ">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-[#C9A961]" /> {blog.date}
              </span>
              <span className="flex items-center gap-2">
                <User size={15} className="text-[#C9A961]" /> By {blog.author}
              </span>
              {blog.tags && blog.tags.length > 0 && (
                <span className="flex items-center gap-2">
                  <Tag size={15} className="text-[#C9A961]" /> {blog.tags[0]}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Main Content - Transparent, pattern shows through */}
        <section className="py-6 bg-pattern min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 md:p-10 mb-10 bg-white/90 backdrop-blur-sm">
                  {/* Main Image */}
                  <div className="rounded-xl overflow-hidden mb-10 shadow-lg">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-auto object-cover max-h-[500px]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-[#1A1A1A] prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                  </div>

                  {/* Quote */}
                  {blog.quote?.text && (
                    <div className="my-10 p-8 md:p-12 bg-[#FAF7F2] border-l-4 border-[#C9A961] rounded-r-2xl relative">
                      <div className="absolute top-4 left-6 text-6xl text-[#C9A961] opacity-20 font-serif">
                        "
                      </div>
                      <p className="text-xl md:text-2xl font-medium italic text-[#1A1A1A] mb-4 leading-relaxed relative z-10">
                        {blog.quote.text}
                      </p>
                      <footer className="text-[#C9A961] font-bold text-sm tracking-widest uppercase">
                        — {blog.quote.author}
                      </footer>
                    </div>
                  )}

                  {/* Secondary Images Grid */}
                  {blog.gallery && blog.gallery.length >= 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                      {blog.gallery.map((img, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl overflow-hidden shadow-sm"
                        >
                          <img
                            src={img}
                            className="w-full h-64 object-cover"
                            alt={`Gallery ${idx}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer of post */}
                  <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black uppercase text-gray-400">
                        Tags:
                      </span>
                      {blog.tags &&
                        blog.tags.map((tag) => (
                          <Link
                            key={tag}
                            to="/stories"
                            className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded hover:bg-[#2C5530] hover:text-white transition-all"
                          >
                            {tag}
                          </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all">
                        <Facebook size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all">
                        <Twitter size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all">
                        <Instagram size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all">
                        <Linkedin size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  {prevPost && (
                    <Link
                      to={`/stories/${prevPost.slug || prevPost.id}`}
                      className="flex-1 bg-white/90 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group backdrop-blur-sm"
                    >
                      <div className="p-2 bg-gray-50 rounded-lg text-[#C9A961] group-hover:bg-[#C9A961] group-hover:text-white transition-all">
                        <ChevronLeft size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Previous Post
                        </span>
                        <h4 className="font-bold text-sm text-[#1A1A1A] line-clamp-1">
                          {prevPost.title}
                        </h4>
                      </div>
                    </Link>
                  )}
                  {nextPost && (
                    <Link
                      to={`/stories/${nextPost.slug || nextPost.id}`}
                      className="flex-1 bg-white/90 p-6 rounded-2xl border border-gray-100 flex items-center justify-end text-right gap-4 hover:shadow-md transition-all group backdrop-blur-sm"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Next Post
                        </span>
                        <h4 className="font-bold text-sm text-[#1A1A1A] line-clamp-1">
                          {nextPost.title}
                        </h4>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-[#C9A961] group-hover:bg-[#C9A961] group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </Link>
                  )}
                </div>

                {/* Comment Section */}
                <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-10 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-8 font-heading">
                    Leave A Comment
                  </h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Name*"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-[#2C5530] outline-none"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-[#2C5530] outline-none"
                        required
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Website"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-[#2C5530] outline-none"
                    />
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="save-info"
                        className="mt-1 w-4 h-4 rounded border-gray-200 text-[#2C5530] focus:ring-[#2C5530]"
                      />
                      <label
                        htmlFor="save-info"
                        className="text-xs text-gray-500 font-medium"
                      >
                        Save my name, email, and website in this browser for the
                        next time I comment.
                      </label>
                    </div>
                    <textarea
                      rows={6}
                      placeholder="Your Comment..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-[#2C5530] outline-none resize-none"
                      required
                    ></textarea>
                    <button className="bg-[#FAB519] text-[#1D161A] px-10 py-4 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-[#FAB519] transition-all shadow-md active:scale-95">
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Use 'as any' if types persist in mismatching due to separate interface definitions, or unify them. */}
                <BlogSidebar blogs={allBlogs as any} />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          className="py-20 bg-cover bg-center relative mt-20 bg-black/60"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
              Ready to Taste the Craft?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Join our cheese club or browse our shop for the best artisan
              cheeses delivered to your door.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-3 bg-white text-[#2C5530] rounded-lg font-bold hover:bg-[#F5E6D3] transition-all"
              >
                Shop Now
              </Link>
              <Link
                to="/wholesale"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-[#2C5530] transition-all"
              >
                Wholesale Inquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

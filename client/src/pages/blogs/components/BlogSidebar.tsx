import { Search, ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
  gallery?: string[];
}

interface BlogSidebarProps {
  blogs?: Blog[];
}

export default function BlogSidebar({ blogs = [] }: BlogSidebarProps) {
  const categories = Array.from(new Set(blogs.map((b) => b.category)));
  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags)));
  const recentPosts = blogs.slice(0, 3);
  const galleryItems = blogs.flatMap((b) => b.gallery || []).slice(0, 6);

  return (
    <aside className="space-y-10">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-12 py-3 bg-white border border-gray-100 rounded-lg shadow-sm outline-none focus:border-[#2C5530] transition-all"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2C5530]">
          <Search size={18} />
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-100 text-[#1A1A1A] font-heading">
          Categories
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category}>
              <Link
                to="/stories"
                className="flex items-center justify-between group text-gray-600 hover:text-[#2C5530] transition-all"
              >
                <span className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-[#C9A961]" />
                  {category}
                </span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#F5E6D3] text-[#2C5530] text-[10px] font-bold rounded-md group-hover:bg-[#2C5530] group-hover:text-white transition-all">
                  {blogs.filter((b) => b.category === category).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Archives - Static for now as usually requires date parsing aggregation */}
      <div>
        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-100 text-[#1A1A1A] font-heading">
          Archives
        </h3>
        <ul className="space-y-3">
          {["May 2024", "April 2024"].map((archive) => (
            <li key={archive}>
              <Link
                to="/stories"
                className="flex items-center gap-2 text-gray-600 hover:text-[#2C5530] transition-all"
              >
                <ChevronRight size={14} className="text-[#C9A961]" />
                {archive}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-100 text-[#1A1A1A] font-heading">
          Recent Posts
        </h3>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <Link
              key={post._id || post.id}
              to={`/stories/${post.slug || post.id}`}
              className="flex gap-4 group"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#1A1A1A] line-clamp-2 group-hover:text-[#2C5530] transition-all mb-1">
                  {post.title}
                </h4>
                <p className="text-[11px] text-[#C9A961] flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Calendar size={10} /> {post.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-100 text-[#1A1A1A] font-heading">
          Gallery
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={item}
                alt="Gallery"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-100 text-[#1A1A1A] font-heading">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              to="/stories"
              className="px-4 py-1.5 bg-white border border-gray-100 text-gray-500 hover:bg-[#2C5530] hover:text-white hover:border-[#2C5530] text-xs font-bold rounded-md transition-all shadow-sm"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

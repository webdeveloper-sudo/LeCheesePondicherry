import { Link } from "react-router-dom";
import { blogs } from "@/data/blogs";

export default function AllBlogs() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/shop-hero-new.jpg")' }}
        />
        <div className="absolute inset-0 hero-overlay opacity-60 bg-black/40" />
        <div className="container mx-auto px-4 relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Cheese Journal
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Stories of tradition, recipes, and the artisan life from the heart
            of Pondicherry.
          </p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map((story) => (
              <Link
                to={`/stories/${story.id}`}
                key={story.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${story.image}")` }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <p className="text-[10px] font-bold text-[#2C5530] uppercase tracking-widest">
                      {story.category}
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[#C9A961] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                    {story.date}
                  </p>
                  <h3
                    className="text-xl font-bold mb-4 group-hover:text-[#2C5530] transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {story.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-bold text-[#2C5530] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Story <span className="text-lg">→</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      By {story.author}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

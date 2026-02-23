import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MotionContainer } from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import axios from "axios";
import { Loader } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  isPublished: boolean;
}

export const BlogsGrid = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blogs`,
        );
        if (response.data.success) {
          // Filter only published blogs for public view
          const publishedBlogs = response.data.data.filter(
            (b: Blog) => b.isPublished !== false,
          );
          setBlogs(publishedBlogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No stories found yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto p-4">
        <MotionContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          stagger
        >
          {blogs.map((story) => (
            <motion.div key={story._id} variants={fadeUp}>
              <Link
                to={`/stories/${story.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-300 group hover:shadow-xl transition-all duration-500 h-full flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-200">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <p className="text-[10px] font-bold text-[#2C5530] uppercase tracking-widest">
                      {story.category}
                    </p>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
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
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-bold text-[#2C5530] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Story <span className="text-lg">→</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      By {story.author}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </MotionContainer>
      </div>
    </section>
  );
};

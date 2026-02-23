import heroImage from "@/assets/images/hero-cheese-board.jpg";
import { BlogsGrid } from "./components/BlogsGrid";

export default function AllBlogs() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
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
      <div className="py-16">
        <BlogsGrid />
      </div>
    </div>
  );
}

import heroImage from "@/assets/images/hero-cheese-board.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { BlogsGrid } from "./components/BlogsGrid";

export default function AllBlogs() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="The Cheese Journal" img={heroImage} />

      {/* Post Grid */}
      <div className="py-16">
        <BlogsGrid />
      </div>
    </div>
  );
}

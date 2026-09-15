import heroImage from "@/assets/images/hero-cheese-board.webp";
import DynamicPageBanner from "@/components/DynamicPageBanner";
import { BlogsGrid } from "./components/BlogsGrid";

export default function AllBlogs() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Dynamic Hero Banner */}
      <DynamicPageBanner
        pageKey="/stories"
        fallbackTitle="The Cheese Journal"
        fallbackVariant="BannerAndBreadCrumb"
        fallbackImage={heroImage}
      />

      {/* Post Grid */}
      <div className="py-16">
        <BlogsGrid />
      </div>
    </div>
  );
}

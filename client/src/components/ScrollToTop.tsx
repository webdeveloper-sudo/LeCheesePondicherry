
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle visibility of scroll-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="md:block hidden">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-[80] p-3 bg-[#2C5530] border border-[#FADB9A] border-2 text-white rounded-full shadow-2xl hover:bg-[#C9A961] transition-all duration-300 animate-in fade-in-out zoom-in-50 group hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
}

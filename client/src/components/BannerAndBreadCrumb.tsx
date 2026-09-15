import React from "react";
import { useLocation, Link } from "react-router-dom";
import defaultBanner from "../assets/images/process-hero-new.webp";

interface BannerAndBreadCrumbProps {
  title?: string;
  img?: any;
  showTitle?: boolean;
}

const BannerAndBreadCrumb = ({
  title,
  img,
  showTitle = true,
}: BannerAndBreadCrumbProps) => {
  const location = useLocation();

  // Safe image handling
  const safeImage = img || defaultBanner;
  const hasTitle = Boolean(title && title.trim().length > 0);

  const validRoutes = new Set([
    "/",
    "/about",
    "/shop",
    "/cart",
    "/checkout",
    "/contact",
    "/faq",
    "/gifts",
    "/privacy",
    "/return",
    "/process",
    "/refund-policy",
    "/shipping-policy",
    "/stories",
    "/terms",
    "/wholesale",
    "/wishlist",
    "/orders",
    "/portfolio",
    "/portfolio/facility",
    "/portfolio/gallery",
    "/portfolio/testimonials",
    "/user",
    "/thank-you",
  ]);

  // Breadcrumb path segments
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Check if route exists and is navigable
  const isValidRoute = (routePath: string) => validRoutes.has(routePath);

  return (
    <section
      className="
        w-full 
        h-[300px] sm:h-[150px] md:h-[300px] lg:h-[400px] xl:h-[450px]
        relative flex items-center justify-center text-white select-none
      "
      style={{
        backgroundImage: `url(${safeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Black/35 overlay with slight gradient when title is applied, or base dark overlay */}
      {hasTitle ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/30" />
      )}

      {/* Top-Left Breadcrumb */}
      <div
        className="
          absolute top-4 left-4 sm:top-5 sm:left-6 md:top-6 md:left-10 lg:left-16
          text-xs sm:text-sm md:text-base font-medium text-white
          flex flex-wrap items-center gap-1.5 sm:gap-2 z-20
          bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm
        "
      >
        <Link to="/" className="hover:underline hover:text-brand-gold transition-colors">
          Home
        </Link>

        {pathnames.length > 0 && <span className="text-white/60">/</span>}

        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const routePath = "/" + pathnames.slice(0, index + 1).join("/");

          return isLast ? (
            <span key={name} className="capitalize text-white font-semibold">
              {name.replace(/-/g, " ")}
            </span>
          ) : (
            <span key={name} className="flex items-center gap-1.5 sm:gap-2">
              {isValidRoute(routePath) ? (
                <Link
                  to={routePath}
                  className="capitalize hover:underline hover:text-brand-gold transition-colors"
                >
                  {name.replace(/-/g, " ")}
                </Link>
              ) : (
                <span className="capitalize text-white/70 pointer-events-none">
                  {name.replace(/-/g, " ")}
                </span>
              )}
              <span className="text-white/60">/</span>
            </span>
          );
        })}
      </div>

      {/* Title in Center if applied */}
      {hasTitle && showTitle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 animate-in fade-in zoom-in-95 duration-500">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>
        </div>
      )}
    </section>
  );
};

export default BannerAndBreadCrumb;

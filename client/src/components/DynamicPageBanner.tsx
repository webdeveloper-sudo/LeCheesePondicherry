import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadcrumbSlider, { CarouselSlide } from "./BreadcrumbSlider";
import BannerAndBreadCrumb from "./BannerAndBreadCrumb";
import { bannerAPI, BannerConfigData } from "@/lib/api";

// In-memory cache for ultra-fast instant rendering across page navigations
let globalBannerCache: Record<string, BannerConfigData> | null = null;
let isFetchingBanners = false;
const listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const clearBannerCache = () => {
  globalBannerCache = null;
};

interface DynamicPageBannerProps {
  pageKey?: string;
  fallbackTitle?: string;
  fallbackVariant?: "BreadcrumbSlider" | "BannerAndBreadCrumb";
  fallbackImages?: string[];
  fallbackImage?: any;
}

export default function DynamicPageBanner({
  pageKey: propPageKey,
  fallbackTitle,
  fallbackVariant = "BannerAndBreadCrumb",
  fallbackImages,
  fallbackImage,
}: DynamicPageBannerProps) {
  const location = useLocation();
  const rawKey = propPageKey || location.pathname;
  const pageKey = (rawKey.startsWith("/") ? rawKey : "/" + rawKey).toLowerCase();

  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((prev) => prev + 1);
    listeners.push(handleUpdate);

    if (!globalBannerCache && !isFetchingBanners) {
      isFetchingBanners = true;
      bannerAPI
        .getAllBanners()
        .then((res) => {
          const rawList = Array.isArray(res.data)
            ? res.data
            : Array.isArray((res.data as any)?.data)
            ? (res.data as any).data
            : [];

          if (rawList && rawList.length > 0) {
            const cache: Record<string, BannerConfigData> = {};
            rawList.forEach((item: BannerConfigData) => {
              if (item?.pageKey) {
                cache[item.pageKey.toLowerCase()] = item;
              }
            });
            globalBannerCache = cache;
            notifyListeners();
          }
        })
        .catch((err) => {
          console.error("Failed to fetch dynamic banners:", err);
        })
        .finally(() => {
          isFetchingBanners = false;
        });
    }

    return () => {
      const idx = listeners.indexOf(handleUpdate);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const config = globalBannerCache ? globalBannerCache[pageKey] : null;

  // Active settings derived from cache or fallbacks
  const variant = config?.variant || fallbackVariant;
  const title = config?.title !== undefined ? config.title : fallbackTitle;

  let slides: CarouselSlide[] = [];
  if (config?.slides && config.slides.length > 0) {
    slides = config.slides;
  } else if (config?.images && config.images.length > 0) {
    slides = config.images.map((img, i) => ({
      image: img,
      title: i === 0 ? config.title : "",
    }));
  } else if (fallbackImages && fallbackImages.length > 0) {
    slides = fallbackImages.map((img) => ({ image: img, title: fallbackTitle }));
  } else if (fallbackImage) {
    slides = [{ image: fallbackImage, title: fallbackTitle }];
  }

  if (variant === "BreadcrumbSlider") {
    return (
      <BreadcrumbSlider
        slides={slides.length > 0 ? slides : undefined}
        title={title}
        showTitle={Boolean(title && title.trim().length > 0)}
      />
    );
  }

  // Default variant: BannerAndBreadCrumb
  return (
    <BannerAndBreadCrumb
      img={slides.length > 0 ? slides[0].image : fallbackImage}
      title={title}
      showTitle={Boolean(title && title.trim().length > 0)}
    />
  );
}

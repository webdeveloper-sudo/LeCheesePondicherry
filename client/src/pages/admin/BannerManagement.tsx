import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Check,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  MoveLeft,
  MoveRight,
  Upload,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  ExternalLink,
  Type,
} from "lucide-react";
import { bannerAPI, BannerConfigData, BannerSlideItem } from "@/lib/api";
import { clearBannerCache } from "@/components/DynamicPageBanner";
import { useToastStore } from "@/store/useToastStore";

interface PageDefinition {
  pageKey: string;
  pageName: string;
  defaultVariant: "BreadcrumbSlider" | "BannerAndBreadCrumb";
  defaultTitle: string;
  defaultSlides: BannerSlideItem[];
}

const MENU_PAGES: PageDefinition[] = [
  {
    pageKey: "/shop",
    pageName: "Shop",
    defaultVariant: "BreadcrumbSlider",
    defaultTitle: "Handcrafted Artisan Cheeses",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
        title: "Handcrafted Artisan Cheeses",
      },
      {
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
        title: "Aged to Perfection in Pondicherry",
      },
      {
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
        title: "Fresh Burrata & Mozzarella Daily",
      },
    ],
  },
  {
    pageKey: "/about",
    pageName: "About Us",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "About Us",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
        title: "About Us",
      },
    ],
  },
  {
    pageKey: "/process",
    pageName: "The Artisan Process",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "The Artisan Process",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
        title: "The Artisan Process",
      },
    ],
  },
  {
    pageKey: "/portfolio/facility",
    pageName: "Our Facility",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Our Modern Facility",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&q=80&w=1600",
        title: "Our Modern Facility",
      },
    ],
  },
  {
    pageKey: "/portfolio/gallery",
    pageName: "Gallery",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Visual Gallery",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
        title: "Visual Gallery",
      },
    ],
  },
  {
    pageKey: "/portfolio/testimonials",
    pageName: "Testimonials",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "What Our Customers Say",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1600",
        title: "What Our Customers Say",
      },
    ],
  },
  {
    pageKey: "/wholesale",
    pageName: "Wholesale",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Wholesale & Partnerships",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=1600",
        title: "Wholesale & Partnerships",
      },
    ],
  },
  {
    pageKey: "/stories",
    pageName: "Journal / Stories",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "The Cheese Journal",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600",
        title: "The Cheese Journal",
      },
    ],
  },
  {
    pageKey: "/contact",
    pageName: "Contact Us",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Get In Touch",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
        title: "Get In Touch",
      },
    ],
  },
  {
    pageKey: "/faq",
    pageName: "FAQ",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Frequently Asked Questions",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
        title: "Frequently Asked Questions",
      },
    ],
  },
  {
    pageKey: "/thank-you",
    pageName: "Thank You",
    defaultVariant: "BannerAndBreadCrumb",
    defaultTitle: "Order Confirmation",
    defaultSlides: [
      {
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
        title: "Order Confirmation",
      },
    ],
  },
];

const createDefaultMap = (): Record<string, BannerConfigData> => {
  const map: Record<string, BannerConfigData> = {};
  MENU_PAGES.forEach((page) => {
    map[page.pageKey] = {
      pageKey: page.pageKey,
      pageName: page.pageName,
      variant: page.defaultVariant,
      title: page.defaultTitle,
      images: page.defaultSlides.map((s) => s.image),
      slides: page.defaultSlides.map((s) => ({ ...s })),
      isActive: true,
    };
  });
  return map;
};

export default function BannerManagement() {
  const { addToast } = useToastStore();
  const [configs, setConfigs] = useState<Record<string, BannerConfigData>>(createDefaultMap);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({
    "/shop": true,
    "/about": true,
  });
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<Record<string, string>>({});
  const [customTitleInput, setCustomTitleInput] = useState<Record<string, string>>({});
  const [previewSlideIndex, setPreviewSlideIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await bannerAPI.getAllBanners();

      // Handle nested payload structure safely
      const rawList = Array.isArray(res.data)
        ? res.data
        : Array.isArray((res.data as any)?.data)
        ? (res.data as any).data
        : [];

      setConfigs((prev) => {
        const nextMap = { ...createDefaultMap(), ...prev };

        if (Array.isArray(rawList) && rawList.length > 0) {
          rawList.forEach((item: BannerConfigData) => {
            if (item?.pageKey) {
              const key = item.pageKey.toLowerCase();
              let normalizedSlides: BannerSlideItem[] = [];

              if (item.slides && item.slides.length > 0) {
                normalizedSlides = item.slides.map((s) => ({
                  image: s.image,
                  title: s.title || "",
                }));
              } else if (item.images && item.images.length > 0) {
                normalizedSlides = item.images.map((img, idx) => ({
                  image: img,
                  title: idx === 0 ? item.title || "" : "",
                }));
              }

              nextMap[key] = {
                ...nextMap[key],
                ...item,
                images: normalizedSlides.map((s) => s.image),
                slides: normalizedSlides,
              };
            }
          });
        }

        return nextMap;
      });
    } catch (err) {
      console.error("Error fetching banners:", err);
      addToast("Loaded default banner configurations.", "info");
    } finally {
      setLoading(false);
    }
  };

  const getSafeConfig = (pageKey: string): BannerConfigData => {
    if (configs[pageKey]) return configs[pageKey];
    const def = MENU_PAGES.find((p) => p.pageKey === pageKey);
    return {
      pageKey,
      pageName: def?.pageName || pageKey,
      variant: def?.defaultVariant || "BannerAndBreadCrumb",
      title: def?.defaultTitle || "",
      images: def?.defaultSlides.map((s) => s.image) || [],
      slides: def?.defaultSlides ? [...def.defaultSlides] : [],
      isActive: true,
    };
  };

  const toggleExpand = (pageKey: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageKey]: !prev[pageKey],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    MENU_PAGES.forEach((p) => (allExpanded[p.pageKey] = true));
    setExpandedPages(allExpanded);
  };

  const collapseAll = () => {
    setExpandedPages({});
  };

  const handleVariantChange = (pageKey: string, variant: "BreadcrumbSlider" | "BannerAndBreadCrumb") => {
    setConfigs((prev) => {
      const current = prev[pageKey] || getSafeConfig(pageKey);
      let newSlides = [...(current.slides || [])];

      if (variant === "BannerAndBreadCrumb" && newSlides.length > 1) {
        newSlides = [newSlides[0]];
      }

      return {
        ...prev,
        [pageKey]: {
          ...current,
          variant,
          slides: newSlides,
          images: newSlides.map((s) => s.image),
        },
      };
    });
  };

  const handlePageTitleChange = (pageKey: string, title: string) => {
    setConfigs((prev) => {
      const current = prev[pageKey] || getSafeConfig(pageKey);
      return {
        ...prev,
        [pageKey]: {
          ...current,
          title,
        },
      };
    });
  };

  const handleSlideTitleChange = (pageKey: string, index: number, slideTitle: string) => {
    setConfigs((prev) => {
      const current = prev[pageKey] || getSafeConfig(pageKey);
      const newSlides = [...(current.slides || [])];
      if (newSlides[index]) {
        newSlides[index] = {
          ...newSlides[index],
          title: slideTitle,
        };
      }
      return {
        ...prev,
        [pageKey]: {
          ...current,
          slides: newSlides,
        },
      };
    });
  };

  const handleAddCustomUrl = (pageKey: string) => {
    const url = customUrlInput[pageKey]?.trim();
    if (!url) return;

    const title = customTitleInput[pageKey]?.trim() || "";

    setConfigs((prev) => {
      const current = prev[pageKey] || getSafeConfig(pageKey);
      const max = current.variant === "BreadcrumbSlider" ? 10 : 1;
      const currentSlides = current.slides || [];

      if (currentSlides.length >= max) {
        addToast(`Maximum ${max} image(s) allowed for ${current.variant}`, "error");
        return prev;
      }

      const updatedSlides = [...currentSlides, { image: url, title }];
      return {
        ...prev,
        [pageKey]: {
          ...current,
          slides: updatedSlides,
          images: updatedSlides.map((s) => s.image),
        },
      };
    });

    setCustomUrlInput((prev) => ({ ...prev, [pageKey]: "" }));
    setCustomTitleInput((prev) => ({ ...prev, [pageKey]: "" }));
  };

  const handleFileUpload = async (pageKey: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const current = configs[pageKey] || getSafeConfig(pageKey);
    const maxAllowed = current.variant === "BreadcrumbSlider" ? 10 : 1;
    const currentSlides = current.slides || [];
    const availableSlots = maxAllowed - currentSlides.length;

    if (availableSlots <= 0) {
      addToast(`Maximum of ${maxAllowed} image(s) already reached for this page.`, "error");
      return;
    }

    setUploadingFor(pageKey);
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        addToast(`File ${file.name} is not an image`, "error");
        continue;
      }

      try {
        const base64 = await convertFileToBase64(file);
        const uploadRes = await bannerAPI.uploadBannerImage({
          base64Data: base64,
          fileName: file.name,
          mimeType: file.type,
        });

        const uploadData = uploadRes.data as any;
        const finalUrl = uploadRes.success && (uploadData?.url || (uploadRes as any).url) ? (uploadData?.url || (uploadRes as any).url) : base64;

        setConfigs((prev) => {
          const cfg = prev[pageKey] || getSafeConfig(pageKey);
          const currentList = cfg.slides || [];
          const updatedSlides = [
            ...currentList,
            { image: finalUrl, title: "" },
          ].slice(0, maxAllowed);

          return {
            ...prev,
            [pageKey]: {
              ...cfg,
              slides: updatedSlides,
              images: updatedSlides.map((s) => s.image),
            },
          };
        });

        addToast(`Uploaded ${file.name} successfully`, "success");
      } catch (err: any) {
        console.error("Upload error:", err);
        addToast(`Failed to upload ${file.name}`, "error");
      }
    }

    setUploadingFor(null);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveSlide = (pageKey: string, index: number) => {
    setConfigs((prev) => {
      const cfg = prev[pageKey] || getSafeConfig(pageKey);
      const currentList = cfg.slides || [];
      const updatedSlides = currentList.filter((_, i) => i !== index);

      return {
        ...prev,
        [pageKey]: {
          ...cfg,
          slides: updatedSlides,
          images: updatedSlides.map((s) => s.image),
        },
      };
    });

    setPreviewSlideIndex((prev) => {
      const current = prev[pageKey] || 0;
      return {
        ...prev,
        [pageKey]: Math.max(0, current - 1),
      };
    });
  };

  const handleMoveSlide = (pageKey: string, index: number, direction: "left" | "right") => {
    setConfigs((prev) => {
      const cfg = prev[pageKey] || getSafeConfig(pageKey);
      const currentList = cfg.slides || [];
      const updatedSlides = [...currentList];
      const targetIndex = direction === "left" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= updatedSlides.length) return prev;

      const temp = updatedSlides[index];
      updatedSlides[index] = updatedSlides[targetIndex];
      updatedSlides[targetIndex] = temp;

      return {
        ...prev,
        [pageKey]: {
          ...cfg,
          slides: updatedSlides,
          images: updatedSlides.map((s) => s.image),
        },
      };
    });

    setPreviewSlideIndex((prev) => ({
      ...prev,
      [pageKey]: direction === "left" ? Math.max(0, index - 1) : index + 1,
    }));
  };

  const handleSaveSingle = async (pageKey: string) => {
    const config = configs[pageKey] || getSafeConfig(pageKey);

    try {
      setSavingKey(pageKey);
      const res = await bannerAPI.updateBanner(pageKey, {
        pageName: config.pageName,
        variant: config.variant,
        title: config.title || "",
        images: (config.slides || []).map((s) => s.image),
        slides: config.slides || [],
        isActive: true,
      });

      if (res.success) {
        clearBannerCache();
        addToast(`Banner settings for "${config.pageName}" saved!`, "success");
      } else {
        addToast(res.message || "Failed to save banner settings", "error");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      addToast(err.message || "Error saving banner settings", "error");
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSavingAll(true);
      let successCount = 0;

      for (const page of MENU_PAGES) {
        const config = configs[page.pageKey] || getSafeConfig(page.pageKey);
        const res = await bannerAPI.updateBanner(page.pageKey, {
          pageName: config.pageName,
          variant: config.variant,
          title: config.title || "",
          images: (config.slides || []).map((s) => s.image),
          slides: config.slides || [],
          isActive: true,
        });
        if (res.success) successCount++;
      }

      clearBannerCache();
      addToast(`Successfully saved banner settings for all ${successCount} pages!`, "success");
    } catch (err: any) {
      console.error("Save all error:", err);
      addToast("Failed to save some banner configurations", "error");
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw size={36} className="animate-spin text-yellow-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading banner configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Global Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/10 text-yellow-600 rounded-xl">
              <SlidersHorizontal size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Banners & Breadcrumbs Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Configure page-wise banner section variants (<span className="font-semibold text-gray-700">BreadcrumbSlider</span> vs <span className="font-semibold text-gray-700">BannerAndBreadCrumb</span>), background images, slide-specific titles, and gradient overlays.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Collapse All
          </button>
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-yellow-600 hover:bg-yellow-700 rounded-xl shadow-md shadow-yellow-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {savingAll ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save All Pages</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <strong>Component & Title Rules:</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
            <li>
              <strong>BreadcrumbSlider:</strong> Multiple image carousel (supports up to <strong>10 images</strong>). Each slide can have its <strong>own custom title</strong>!
            </li>
            <li>
              <strong>BannerAndBreadCrumb:</strong> Single background image + page title.
            </li>
            <li>
              <strong>Title & Overlay Rule:</strong> Whenever a title is applied to a slide/banner, a <span className="font-mono bg-amber-200/60 px-1 py-0.5 rounded text-amber-950 font-bold">black/35 gradient overlay (rgba(0,0,0,0.35))</span> is automatically applied to ensure crisp, elegant readability.
            </li>
          </ul>
        </div>
      </div>

      {/* Pages List - Row by Row */}
      <div className="space-y-6">
        {MENU_PAGES.map((page, pageIndex) => {
          const cfg = getSafeConfig(page.pageKey);
          const isExpanded = !!expandedPages[page.pageKey];
          const isSaving = savingKey === page.pageKey;
          const isSlider = cfg.variant === "BreadcrumbSlider";
          const maxSlides = isSlider ? 10 : 1;
          const slides = cfg.slides || [];
          const activeSlideIdx = Math.min(
            previewSlideIndex[page.pageKey] || 0,
            Math.max(0, slides.length - 1)
          );
          const currentPreviewSlide = slides[activeSlideIdx];
          const activeTitle = currentPreviewSlide?.title?.trim() || (cfg.title?.trim() || "");
          const hasActiveTitle = Boolean(activeTitle.length > 0);

          return (
            <div
              key={page.pageKey}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-gray-300"
            >
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(page.pageKey)}
                className="px-5 py-4 bg-gray-50/80 hover:bg-gray-100/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-800 font-black text-xs flex items-center justify-center border border-yellow-200">
                    {pageIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                        {cfg.pageName}
                      </h3>
                      <span className="font-mono text-xs px-2 py-0.5 bg-gray-200/70 text-gray-700 rounded-md">
                        {page.pageKey}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>Active Variant: <strong className="text-gray-800">{cfg.variant}</strong></span>
                      <span>•</span>
                      <span>{slides.length} / {maxSlides} slide(s)</span>
                      {cfg.title && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 font-medium truncate max-w-xs">
                            Default: &ldquo;{cfg.title}&rdquo;
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={page.pageKey}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/60 rounded-lg text-xs flex items-center gap-1 transition-colors"
                    title="View page in new tab"
                  >
                    <ExternalLink size={15} />
                    <span className="hidden sm:inline">View Page</span>
                  </a>

                  <button
                    onClick={() => handleSaveSingle(page.pageKey)}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    <span>Save</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(page.pageKey)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Collapsible Body */}
              {isExpanded && (
                <div className="p-5 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Variant & Add Image Controls */}
                    <div className="lg:col-span-5 space-y-5">
                      {/* Variant Selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          1. Banner Component Variant
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleVariantChange(page.pageKey, "BreadcrumbSlider")}
                            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                              isSlider
                                ? "border-yellow-600 bg-yellow-50/50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                <Sliders size={15} className="text-yellow-600" />
                                BreadcrumbSlider
                              </span>
                              {isSlider && <Check size={16} className="text-yellow-600" />}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight">
                              Multi-image slider (up to 10 images) with individual titles per slide
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVariantChange(page.pageKey, "BannerAndBreadCrumb")}
                            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                              !isSlider
                                ? "border-yellow-600 bg-yellow-50/50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                <ImageIcon size={15} className="text-yellow-600" />
                                BannerAndBreadCrumb
                              </span>
                              {!isSlider && <Check size={16} className="text-yellow-600" />}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight">
                              Single background hero image + page title
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Default / Page Title */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            2. {isSlider ? "Default Banner Title (Optional)" : "Page Banner Title (Optional)"}
                          </label>
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                            {cfg.title?.trim() ? "Gradient overlay active" : "No overlay"}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={cfg.title || ""}
                          onChange={(e) => handlePageTitleChange(page.pageKey, e.target.value)}
                          placeholder="e.g. Handcrafted Artisan Cheeses (optional)"
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          {isSlider
                            ? "Acts as a fallback title for slides that don't have an individual title."
                            : "Displayed in the center with a black/35 gradient overlay."}
                        </p>
                      </div>

                      {/* Add Image via URL or Upload */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            3. Add {isSlider ? "Slide" : "Banner"} ({slides.length}/{maxSlides})
                          </label>
                          <span className="text-[11px] text-gray-500">
                            Max {maxSlides} image{maxSlides > 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* File Upload Button */}
                        <div className="space-y-3">
                          <label
                            className={`w-full py-3 px-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              slides.length >= maxSlides || uploadingFor === page.pageKey
                                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "border-yellow-400 bg-yellow-50/30 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500"
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple={isSlider}
                              disabled={slides.length >= maxSlides || uploadingFor === page.pageKey}
                              onChange={(e) => handleFileUpload(page.pageKey, e.target.files)}
                              className="hidden"
                            />
                            {uploadingFor === page.pageKey ? (
                              <RefreshCw size={16} className="animate-spin text-yellow-600" />
                            ) : (
                              <Upload size={16} />
                            )}
                            <span className="text-xs font-bold">
                              {uploadingFor === page.pageKey
                                ? "Uploading to Cloud..."
                                : isSlider
                                ? `Upload Banner Images (up to ${maxSlides})`
                                : "Upload Background Image"}
                            </span>
                          </label>

                          {/* URL and Slide Title Input */}
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                            <input
                              type="text"
                              value={customUrlInput[page.pageKey] || ""}
                              onChange={(e) =>
                                setCustomUrlInput((prev) => ({
                                  ...prev,
                                  [page.pageKey]: e.target.value,
                                }))
                              }
                              placeholder="Direct image URL (e.g. https://...)"
                              disabled={slides.length >= maxSlides}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-yellow-500 bg-white"
                            />

                            {isSlider && (
                              <input
                                type="text"
                                value={customTitleInput[page.pageKey] || ""}
                                onChange={(e) =>
                                  setCustomTitleInput((prev) => ({
                                    ...prev,
                                    [page.pageKey]: e.target.value,
                                  }))
                                }
                                placeholder="Slide Title (optional)..."
                                disabled={slides.length >= maxSlides}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-yellow-500 bg-white"
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => handleAddCustomUrl(page.pageKey)}
                              disabled={slides.length >= maxSlides || !customUrlInput[page.pageKey]?.trim()}
                              className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                            >
                              <Plus size={14} />
                              <span>Add to Slider</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Manage Slides & Live Preview */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Managed Slides Strip & Individual Titles */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Managed {isSlider ? "Slides & Titles" : "Banner Image"} ({slides.length})
                          </label>
                          {isSlider && slides.length > 1 && (
                            <span className="text-[11px] text-gray-500">
                              Use arrows to reorder slide sequence
                            </span>
                          )}
                        </div>

                        {slides.length === 0 ? (
                          <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
                            <ImageIcon size={28} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-xs font-semibold text-gray-600">No slides added yet</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Upload an image or paste a URL above to display in this banner.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                            {slides.map((slide, sIdx) => (
                              <div
                                key={sIdx}
                                className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row items-center gap-3 ${
                                  activeSlideIdx === sIdx
                                    ? "bg-yellow-50/50 border-yellow-400 shadow-xs"
                                    : "bg-gray-50/80 border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                {/* Thumbnail */}
                                <div
                                  onClick={() =>
                                    setPreviewSlideIndex((prev) => ({
                                      ...prev,
                                      [page.pageKey]: sIdx,
                                    }))
                                  }
                                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 w-28 h-16 flex-shrink-0 cursor-pointer shadow-2xs"
                                >
                                  <img
                                    src={slide.image}
                                    alt={`Slide ${sIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    #{sIdx + 1}
                                  </span>

                                  {/* Quick Actions on Hover */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                                    {isSlider && sIdx > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveSlide(page.pageKey, sIdx, "left");
                                        }}
                                        className="p-1 bg-white text-gray-800 rounded hover:bg-yellow-400 transition-colors"
                                        title="Move Up/Left"
                                      >
                                        <MoveLeft size={12} />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSlide(page.pageKey, sIdx);
                                      }}
                                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                      title="Delete Slide"
                                    >
                                      <Trash2 size={12} />
                                    </button>

                                    {isSlider && sIdx < slides.length - 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveSlide(page.pageKey, sIdx, "right");
                                        }}
                                        className="p-1 bg-white text-gray-800 rounded hover:bg-yellow-400 transition-colors"
                                        title="Move Down/Right"
                                      >
                                        <MoveRight size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Slide Title Input */}
                                <div className="flex-1 w-full space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                                      <Type size={12} className="text-yellow-600" />
                                      Slide #{sIdx + 1} Custom Title
                                    </span>
                                    {slide.title?.trim() ? (
                                      <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                        Overlay Active
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-gray-400">
                                        No Title (Subtle BG)
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={slide.title || ""}
                                    onChange={(e) =>
                                      handleSlideTitleChange(page.pageKey, sIdx, e.target.value)
                                    }
                                    placeholder={
                                      isSlider
                                        ? `Custom title for slide #${sIdx + 1} (optional)`
                                        : "Banner title..."
                                    }
                                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-yellow-500"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {isSlider && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={sIdx === 0}
                                        onClick={() => handleMoveSlide(page.pageKey, sIdx, "left")}
                                        className="p-1.5 bg-gray-200 hover:bg-yellow-400 text-gray-700 rounded-md transition-colors disabled:opacity-30"
                                        title="Move Up/Left"
                                      >
                                        <MoveLeft size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={sIdx === slides.length - 1}
                                        onClick={() => handleMoveSlide(page.pageKey, sIdx, "right")}
                                        className="p-1.5 bg-gray-200 hover:bg-yellow-400 text-gray-700 rounded-md transition-colors disabled:opacity-30"
                                        title="Move Down/Right"
                                      >
                                        <MoveRight size={13} />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSlide(page.pageKey, sIdx)}
                                    className="p-1.5 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 rounded-md transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Live Component Preview */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye size={14} className="text-yellow-600" />
                            Live Component Preview ({cfg.variant})
                          </label>
                          {isSlider && slides.length > 1 && (
                            <div className="flex items-center gap-1">
                              {slides.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={() =>
                                    setPreviewSlideIndex((prev) => ({
                                      ...prev,
                                      [page.pageKey]: dotIdx,
                                    }))
                                  }
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    activeSlideIdx === dotIdx
                                      ? "w-4 bg-yellow-600"
                                      : "bg-gray-300 hover:bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Banner Mock Component */}
                        <div className="relative w-full h-[190px] sm:h-[230px] rounded-2xl overflow-hidden shadow-inner border border-gray-300 bg-gray-950 select-none">
                          {slides.length > 0 && currentPreviewSlide ? (
                            <div
                              className="absolute inset-0 transition-all duration-700 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${currentPreviewSlide.image})`,
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                              No image assigned
                            </div>
                          )}

                          {/* Gradient / Black/35 Overlay when Title is present on the active slide */}
                          {hasActiveTitle ? (
                            <div
                              className="absolute inset-0 transition-opacity duration-500"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)",
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-black/20" />
                          )}

                          {/* Breadcrumb Preview Badge (Top Left) */}
                          <div className="absolute top-3 left-4 text-[11px] font-medium text-white flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                            <span>Home</span>
                            <span className="text-white/60">/</span>
                            <span className="text-yellow-400 font-semibold">{cfg.pageName}</span>
                          </div>

                          {/* Center Title Preview for Active Slide */}
                          {hasActiveTitle && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 animate-in fade-in zoom-in-95 duration-300">
                              <h4
                                className="text-lg sm:text-2xl font-bold text-white drop-shadow-md"
                                style={{ fontFamily: "serif" }}
                              >
                                {activeTitle}
                              </h4>
                              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1">
                                Le Pondicherry Cheese Artisan
                              </p>
                            </div>
                          )}

                          {/* Slider Navigation Arrows */}
                          {isSlider && slides.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewSlideIndex((prev) => ({
                                    ...prev,
                                    [page.pageKey]:
                                      (activeSlideIdx - 1 + slides.length) % slides.length,
                                  }))
                                }
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center text-xs shadow-md transition-all font-bold"
                              >
                                ‹
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewSlideIndex((prev) => ({
                                    ...prev,
                                    [page.pageKey]: (activeSlideIdx + 1) % slides.length,
                                  }))
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center text-xs shadow-md transition-all font-bold"
                              >
                                ›
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

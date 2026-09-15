const BannerConfig = require("../models/BannerConfig");
const { uploadFile } = require("../utils/googleDrive");

const DEFAULT_BANNER_CONFIGS = [
  {
    pageKey: "/shop",
    pageName: "Shop",
    variant: "BreadcrumbSlider",
    title: "Handcrafted Artisan Cheeses",
    slides: [
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
    images: [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/about",
    pageName: "About Us",
    variant: "BannerAndBreadCrumb",
    title: "About Us",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
        title: "About Us",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/process",
    pageName: "The Artisan Process",
    variant: "BannerAndBreadCrumb",
    title: "The Artisan Process",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
        title: "The Artisan Process",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/portfolio/facility",
    pageName: "Our Facility",
    variant: "BannerAndBreadCrumb",
    title: "Our Modern Facility",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&q=80&w=1600",
        title: "Our Modern Facility",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/portfolio/gallery",
    pageName: "Gallery",
    variant: "BannerAndBreadCrumb",
    title: "Visual Gallery",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
        title: "Visual Gallery",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/portfolio/testimonials",
    pageName: "Testimonials",
    variant: "BannerAndBreadCrumb",
    title: "What Our Customers Say",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1600",
        title: "What Our Customers Say",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/wholesale",
    pageName: "Wholesale",
    variant: "BannerAndBreadCrumb",
    title: "Wholesale & Partnerships",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=1600",
        title: "Wholesale & Partnerships",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/stories",
    pageName: "Journal / Stories",
    variant: "BannerAndBreadCrumb",
    title: "The Cheese Journal",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600",
        title: "The Cheese Journal",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/contact",
    pageName: "Contact Us",
    variant: "BannerAndBreadCrumb",
    title: "Get In Touch",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
        title: "Get In Touch",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/faq",
    pageName: "FAQ",
    variant: "BannerAndBreadCrumb",
    title: "Frequently Asked Questions",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
        title: "Frequently Asked Questions",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    pageKey: "/thank-you",
    pageName: "Thank You",
    variant: "BannerAndBreadCrumb",
    title: "Order Confirmation",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
        title: "Order Confirmation",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=1600",
    ],
  },
];

/**
 * Ensures all default pages exist in the database and have slides populated
 */
const ensureDefaultSeeds = async () => {
  for (const def of DEFAULT_BANNER_CONFIGS) {
    const existing = await BannerConfig.findOne({ pageKey: def.pageKey.toLowerCase() });
    if (!existing) {
      await BannerConfig.create(def);
    } else if (!existing.slides || existing.slides.length === 0) {
      // Sync slides if missing
      existing.slides = def.slides || existing.images.map((img) => ({ image: img, title: existing.title || "" }));
      await existing.save();
    }
  }
};

/**
 * @desc    Get all banner configurations
 * @route   GET /api/banners
 * @access  Public
 */
const getAllBannerConfigs = async (req, res) => {
  try {
    let configs = await BannerConfig.find().sort({ createdAt: 1 });
    if (!configs || configs.length < DEFAULT_BANNER_CONFIGS.length) {
      await ensureDefaultSeeds();
      configs = await BannerConfig.find().sort({ createdAt: 1 });
    }

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error("Error fetching banner configs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner configurations",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single banner configuration by pageKey
 * @route   GET /api/banners/:pageKey
 * @access  Public
 */
const getBannerConfigByPage = async (req, res) => {
  try {
    const rawKey = req.params.pageKey;
    const pageKey = (rawKey.startsWith("/") ? rawKey : "/" + rawKey).toLowerCase();

    let config = await BannerConfig.findOne({ pageKey });
    if (!config) {
      const def = DEFAULT_BANNER_CONFIGS.find((d) => d.pageKey === pageKey);
      if (def) {
        config = await BannerConfig.create(def);
      }
    }

    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Banner configuration for page '${pageKey}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error fetching page banner config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner config",
      error: error.message,
    });
  }
};

/**
 * @desc    Update or create banner configuration for a page
 * @route   PUT /api/banners/:pageKey
 * @access  Private/Admin
 */
const updateBannerConfig = async (req, res) => {
  try {
    const rawKey = req.params.pageKey;
    let pageKey = decodeURIComponent(rawKey);
    if (!pageKey.startsWith("/")) {
      pageKey = "/" + pageKey;
    }
    pageKey = pageKey.toLowerCase();

    const { pageName, variant, title, images, slides, isActive } = req.body;

    if (variant && !["BreadcrumbSlider", "BannerAndBreadCrumb"].includes(variant)) {
      return res.status(400).json({
        success: false,
        message: "Invalid variant. Must be BreadcrumbSlider or BannerAndBreadCrumb",
      });
    }

    const maxAllowed = variant === "BreadcrumbSlider" ? 10 : 1;

    // Process slides & images
    let sanitizedSlides = [];
    let sanitizedImages = [];

    if (Array.isArray(slides) && slides.length > 0) {
      sanitizedSlides = slides
        .filter((s) => s && (typeof s === "string" || s.image))
        .map((s) => (typeof s === "string" ? { image: s, title: "" } : { image: s.image, title: s.title || "" }))
        .slice(0, maxAllowed);
      sanitizedImages = sanitizedSlides.map((s) => s.image);
    } else if (Array.isArray(images) && images.length > 0) {
      sanitizedImages = images.filter(Boolean).slice(0, maxAllowed);
      sanitizedSlides = sanitizedImages.map((img, i) => ({
        image: img,
        title: i === 0 ? (title || "") : "",
      }));
    }

    const updateData = {
      ...(pageName && { pageName }),
      ...(variant && { variant }),
      title: title !== undefined ? title : "",
      images: sanitizedImages,
      slides: sanitizedSlides,
      ...(typeof isActive === "boolean" && { isActive }),
    };

    const config = await BannerConfig.findOneAndUpdate(
      { pageKey },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Banner configuration updated successfully",
      data: config,
    });
  } catch (error) {
    console.error("Error updating banner config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update banner configuration",
      error: error.message,
    });
  }
};

/**
 * @desc    Upload an image for banner
 * @route   POST /api/banners/upload-image
 * @access  Private/Admin
 */
const uploadBannerImage = async (req, res) => {
  try {
    const { base64Data, fileName, mimeType } = req.body;

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: "Image base64 data is required",
      });
    }

    const name = fileName || `banner-${Date.now()}.jpg`;
    const type = mimeType || "image/jpeg";

    const publicUrl = await uploadFile(name, type, base64Data);

    res.status(200).json({
      success: true,
      message: "Banner image uploaded successfully",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Banner image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload banner image",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBannerConfigs,
  getBannerConfigByPage,
  updateBannerConfig,
  uploadBannerImage,
  ensureDefaultSeeds,
};

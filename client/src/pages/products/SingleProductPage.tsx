import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products as staticProducts, Product } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import { FETCH_MODE, API_BASE_URL } from "@/config";
import axios from "axios";
import { Loader } from "lucide-react";
import { trackViewItem } from "@/lib/gtm";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        if (FETCH_MODE === "static") {
          const currentProduct = staticProducts.find((p) => p.id === slug);
          if (currentProduct) {
            setProduct(currentProduct);
            setRelatedProducts(
              staticProducts.filter((p) => p.id !== slug).slice(0, 4),
            );
          }
        } else {
          // Dynamic Mode - fetch from DB
          try {
            const allRes = await axios.get(`${API_BASE_URL}/api/products`);
            const allFetched = allRes.data?.data || allRes.data || [];

            const mapProduct = (p: any) => {
              let hash = 0;
              const pid = p.slug || p._id || "";
              for (let i = 0; i < pid.length; i++) {
                hash = pid.charCodeAt(i) + ((hash << 5) - hash);
              }
              const assignedRating = 4.0 + (Math.abs(hash) % 6) / 10;
              return {
                ...p,
                id: p.slug || p._id,
                slug: p.slug || p._id,
                _id: p._id,
                rating: p.rating && p.rating > 0 ? p.rating : assignedRating,
              };
            };

            const mappedAll: Product[] = allFetched.map(mapProduct);

            // Find current product in mapped dynamic products
            let matchedProduct = mappedAll.find(
              (p: any) => p.slug === slug || p._id === slug || p.id === slug
            );

            // If not found yet and slug might be MongoDB ObjectId, try direct endpoint
            if (!matchedProduct && slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
              try {
                const singleRes = await axios.get(`${API_BASE_URL}/api/products/${slug}`);
                if (singleRes.data?.data || singleRes.data) {
                  matchedProduct = mapProduct(singleRes.data.data || singleRes.data);
                }
              } catch (singleErr) {
                console.warn("Direct product lookup error:", singleErr);
              }
            }

            if (matchedProduct) {
              setProduct(matchedProduct);
              setRelatedProducts(
                mappedAll
                  .filter((p: any) => p.id !== matchedProduct?.id && p.slug !== slug)
                  .slice(0, 4)
              );
            } else {
              // Fallback to static if not found in DB
              const staticMatch = staticProducts.find((p) => p.id === slug);
              if (staticMatch) {
                setProduct(staticMatch);
                setRelatedProducts(
                  staticProducts.filter((p) => p.id !== slug).slice(0, 4)
                );
              }
            }
          } catch (apiError) {
            console.warn("Failed to fetch dynamic product details, falling back to static:", apiError);
            const currentProduct = staticProducts.find((p) => p.id === slug);
            if (currentProduct) {
              setProduct(currentProduct);
              setRelatedProducts(
                staticProducts.filter((p) => p.id !== slug).slice(0, 4)
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      trackViewItem({
        item_id: String(product.id || product.slug || slug),
        item_name: product.name,
        price: Number(product.price),
        item_category: product.category || "Artisanal Cheese",
        item_variant: product.weight || "200g",
      });
    }
  }, [product?.id, product?.name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern">
        <Loader className="animate-spin text-[#2C5530]" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern">
        <p className="text-lg text-[#6B6B6B]">Product not found.</p>
      </div>
    );
  }

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://lepondicheese.com${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Le Pondicherry Cheese",
    },
    offers: {
      "@type": "Offer",
      url: `https://lepondicheese.com/products/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

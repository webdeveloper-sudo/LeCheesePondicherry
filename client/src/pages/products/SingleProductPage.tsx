import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products as staticProducts, Product } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import { FETCH_MODE } from "@/config";
import axios from "axios";
import { Loader } from "lucide-react";

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
          // Dynamic Mode
          const [productRes, allRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/api/products/${slug}`),
            axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
          ]);

          if (productRes.data.success || productRes.data) {
            const fetchedProduct = productRes.data.data || productRes.data;

            let hash = 0;
            const id = fetchedProduct._id || "";
            for (let i = 0; i < id.length; i++) {
              hash = id.charCodeAt(i) + ((hash << 5) - hash);
            }
            const assignedRating = 4.0 + (Math.abs(hash) % 6) / 10;

            const mappedProduct = {
              ...fetchedProduct,
              id: fetchedProduct._id,
              rating:
                fetchedProduct.rating && fetchedProduct.rating > 0
                  ? fetchedProduct.rating
                  : assignedRating,
            };
            setProduct(mappedProduct);
          }

          if (allRes.data.success || allRes.data) {
            const allFetched = allRes.data.data || allRes.data;
            const mappedRelated = allFetched
              .filter((p: any) => p._id !== slug)
              .slice(0, 4)
              .map((p: any) => {
                let rHash = 0;
                const rId = p._id || "";
                for (let i = 0; i < rId.length; i++) {
                  rHash = rId.charCodeAt(i) + ((rHash << 5) - rHash);
                }
                const rAssignedRating = 4.0 + (Math.abs(rHash) % 6) / 10;

                return {
                  ...p,
                  id: p._id,
                  rating: p.rating && p.rating > 0 ? p.rating : rAssignedRating,
                };
              });
            setRelatedProducts(mappedRelated);
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

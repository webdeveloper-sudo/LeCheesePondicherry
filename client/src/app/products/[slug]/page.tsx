import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.id === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-[#6B6B6B]">Product not found.</p>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

    // Product Schema
  const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": `https://lepondicheese.com${product.image}`,
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": "Le Pondicherry Cheese"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://lepondicheese.com/products/${product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviews
        }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}

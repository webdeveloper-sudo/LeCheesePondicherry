import { Metadata } from 'next';
import { products } from '@/data/products';
import ProductDetailClient from '@/components/ProductDetailClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = products.find(p => p.id === slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.shortDescription,
        openGraph: {
            title: `${product.name} | Le Pondicherry Cheese`,
            description: product.description,
            images: [product.image],
            url: `https://lepondicheese.com/products/${product.id}`,
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = products.find(p => p.id === slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

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

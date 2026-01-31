import { MetadataRoute } from 'next';
import { products } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://lepondicheese.com';

    // Base routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/process',
        '/faq',
        '/wholesale',
        '/gifts',
        '/stories',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Product routes
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...productRoutes];
}

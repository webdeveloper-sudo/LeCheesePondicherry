import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopClient from '@/components/ShopClient';

export const metadata: Metadata = {
    title: 'Shop Artisan Cheeses',
    description: 'Explore our collection of handcrafted artisan cheeses. From aged cheddars to fresh burrata, delivered fresh from Pondicherry to your home.',
    openGraph: {
        title: 'Shop Artisan Cheeses | Le Pondicherry Cheese',
        description: 'Discover the finest handcrafted cheeses in India. Shop now for delivery.',
        url: 'https://lepondicheese.com/shop',
    },
};

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#2C5530] font-semibold">Loading Cheeses...</div>}>
            <ShopClient />
        </Suspense>
    );
}

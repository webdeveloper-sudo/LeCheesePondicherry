import { Suspense } from 'react';
import ShopClient from '@/components/ShopClient';
import Seo from '@/components/Seo';
import { SHOP_SEO } from '@/seo/seoConfig';

export default function ShopPage() {
    return (
        <>
            <Seo {...SHOP_SEO} />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#2C5530] font-semibold">Loading Cheeses...</div>}>
                <ShopClient />
            </Suspense>
        </>
    );
}

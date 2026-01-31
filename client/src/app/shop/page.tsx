import { Suspense } from 'react';
import ShopClient from '@/components/ShopClient';

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#2C5530] font-semibold">Loading Cheeses...</div>}>
            <ShopClient />
        </Suspense>
    );
}

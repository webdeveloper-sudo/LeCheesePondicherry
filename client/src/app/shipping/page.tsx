'use client';

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Shipping & Delivery</h1>

                <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-[#2C5530]" style={{ fontFamily: 'var(--font-heading)' }}>Our Commitment to Freshness</h2>
                        <p className="text-[#6B6B6B] leading-relaxed">
                            Le Pondicherry Cheese is a living, artisan product. To ensure that our cheeses arrive at your doorstep with their delicate flavors and textures intact, we have pioneered a "Farm-to-Table Cold Chain" system specifically designed for the Indian climate.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#FAF7F2] p-6 rounded-lg border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>Pondicherry & Auroville</h3>
                            <ul className="space-y-3 text-sm text-[#6B6B6B]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Schedule: Same-day delivery for orders before 11:00 AM.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Logistics: Dedicated temperature-controlled electric fleet.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Fee: Flat ₹49 (Waived for orders above ₹1,000).</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#FAF7F2] p-6 rounded-lg border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>National Shipping</h3>
                            <ul className="space-y-3 text-sm text-[#6B6B6B]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Coverage: All major metros via premium cold-chain couriers.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Transit: 24-48 hour delivery windows only.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span>Fee: Flat ₹199 (Waived for orders above ₹2,500).</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <section>
                        <h3 className="text-xl font-bold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>Temperature-Ready Packaging</h3>
                        <p className="text-[#6B6B6B] mb-4">
                            Every outstation order is packed in a triple-layered thermal insulation system:
                        </p>
                        <div className="space-y-3 text-sm text-[#6B6B6B] ml-4">
                            <p><strong>Step 1:</strong> Direct vacuum-sealed food-grade wrap to maintain moisture.</p>
                            <p><strong>Step 2:</strong> Expanded Polystyrene (EPS) thermal box reinforced with non-toxic gel ice packs.</p>
                            <p><strong>Step 3:</strong> Outer corrugated shield for structural integrity during transit.</p>
                        </div>
                    </section>

                    <section className="bg-[#2C5530] text-white p-8 rounded-lg shadow-sm border border-dashed border-[#C9A961]">
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Sustainability Note</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            As part of our AGOC sustainability mandate, all our thermal boxes are recyclable, and our gel packs are reusable for your household needs. We are currently piloting a bottle-return and box-return program for our loyal customers in Pondicherry.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

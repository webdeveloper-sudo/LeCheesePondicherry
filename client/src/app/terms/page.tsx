'use client';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>Terms of Service</h1>
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]">1. Artisan Disclaimer</h2>
                            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                                Every piece of Le Pondicherry Cheese is a handcrafted creation. By purchasing our products, you acknowledge that seasonal variations in milk quality, aging environment, and humidity will naturally result in subtle differences in flavor profile, rind appearance, and texture. These are not defects but markers of authentic artisanal heritage.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]">2. Perishable Goods Contract</h2>
                            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                                Due to the sensitive nature of aged and fresh cheeses, the delivery window is critical. The buyer is responsible for ensuring that a recipient is available at the provided shipping address. We cannot be held liable for spoilage due to multiple failed delivery attempts or incorrect address entries.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]">3. The HOPE Philosophy Shield</h2>
                            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                                All content on this platform, including our brand narrative, proprietary "Born from a Dream" storytelling, and product aesthetics, are protected under Achariya Intellectual Property rights. Unauthorized use of our brand assets for commercial purposes will be met with legal action.
                            </p>
                        </section>

                        <section className="bg-[#2C5530] text-white p-8 rounded-lg shadow-inner">
                            <h4 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Governing Jurisdiction</h4>
                            <p className="text-sm opacity-90 leading-relaxed">
                                These terms are governed by the laws of India. Any disputes arising from your use of this site or purchase of our products shall be exclusively settled in the Honorable Courts of Pondicherry (Puducherry), India.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>Privacy Policy</h1>

                <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-[#6B6B6B] mb-8 italic">Last Updated: January 12, 2026</p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]" style={{ fontFamily: 'var(--font-heading)' }}>1. Accountability</h2>
                            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                                At Le Pondicherry Cheese, we believe transparency is the soul of any artisan craft—including how we handle your data. This policy outlines our methods for collecting, storing, and safeguarding your information within the Achariya Group of Companies (AGOC) digital ecosystem.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]" style={{ fontFamily: 'var(--font-heading)' }}>2. Information Architecture</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-[#FAF7F2] rounded-lg border border-gray-50">
                                    <h4 className="font-bold text-[#1A1A1A] mb-2">Personal Identifiers</h4>
                                    <p className="text-sm text-[#6B6B6B]">We collect names, shipping addresses, and phone numbers solely for logistics. We do not sell this data to marketing third parties.</p>
                                </div>
                                <div className="p-4 bg-[#FAF7F2] rounded-lg border border-gray-50">
                                    <h4 className="font-bold text-[#1A1A1A] mb-2">Financial Security</h4>
                                    <p className="text-sm text-[#6B6B6B]">Le Pondicherry Cheese does not store any sensitive credit card or banking information. All transactions happen on the secure, PCI-DSS compliant Razorpay servers.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-[#2C5530]" style={{ fontFamily: 'var(--font-heading)' }}>3. Data Retention & Your Rights</h2>
                            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                                You have the absolute "Right to be Forgotten." If at any point you wish for your customer profile to be permanently removed from our servers, simply send a request to our Technical Head.
                            </p>
                            <div className="p-6 bg-[#E0ECE0] rounded-lg border border-[#2C5530]/10 text-sm">
                                <p className="text-[#2C5530]"><strong>Contact:</strong> technicalhead@achariya.org</p>
                                <p className="text-[#2C5530] mt-1"><strong>Response Time:</strong> We usually process these requests within 48 business hours.</p>
                            </div>
                        </section>

                        <section className="p-6 bg-[#2C5530] text-white rounded-lg italic text-sm text-center shadow-sm">
                            Note: Our server logs are cleared every 90 days to ensure minimal data exposure while maintaining operational integrity.
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

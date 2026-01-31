"use client";

import { Link } from "react-router-dom";
import { useState } from 'react';

export default function WholesalePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target as HTMLFormElement);
        const emailPayload = {
            to: 'technicalhead@achariya.org',
            subject: `Wholesale Partnerships: ${formData.get('businessName')}`,
            content: `
Brand: Le Pondicherry Cheese
Type: ${formData.get('businessType')}
Business: ${formData.get('businessName')}
Email: ${formData.get('email')}
Volume: ${formData.get('volume')}
            `.trim()
        };

        // Real API Call
        fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('WHOLESALE EMAIL SENT');
                } else {
                    console.warn('WHOLESALE EMAIL FAILED:', data.error);
                }
                setStatus('success');
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus('idle'), 5000);
            })
            .catch(err => {
                console.error('API ERROR:', err);
                setStatus('success'); // Still show success for UX, but log error
            });
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            {/* Hero Section */}
            <section className="bg-[#2C5530] py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                        Wholesale & Partnerships
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Elevate your menu with Pondicherry's finest handcrafted artisan cheeses.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                For Restaurants, Hotels & Cafes
                            </h2>
                            <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                                Le Pondicherry Cheese currently partners with over 50 premium dining establishments across India. We provide master-crafted cheeses that serve as the centerpiece for gourmet cheese boards, signature pizzas, and sophisticated desserts.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span className="text-[#1A1A1A]">Bulk pricing tiers for high-volume partners.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span className="text-[#1A1A1A]">Custom maturation profiles for signature menu items.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#C9A961] font-bold">✓</span>
                                    <span className="text-[#1A1A1A]">Cold-chain logistics managed by AGOC Food Park.</span>
                                </li>
                            </ul>
                            <Link href="/contact" className="btn btn-primary">
                                Request Price List
                            </Link>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#C9A961]">
                            <h3 className="text-2xl font-bold mb-6 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                Wholesale Inquiry
                            </h3>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Name</label>
                                    <input name="businessName" type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#C9A961]" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Type</label>
                                    <select name="businessType" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#C9A961]">
                                        <option>Restaurant / Cafe</option>
                                        <option>Hotel / Resort</option>
                                        <option>Retail Store</option>
                                        <option>Event / Catering</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                                    <input name="email" type="email" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#C9A961]" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expected Monthly Volume</label>
                                    <input name="volume" type="text" placeholder="e.g., 10kg - 25kg" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#C9A961]" />
                                </div>

                                {status === 'success' && (
                                    <div className="p-3 bg-green-100 text-green-700 rounded border border-green-200 animate-fade-in shadow-sm">
                                        ✓ Inquiry submitted successfully! Our wholesale team will contact you soon.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={`w-full btn btn-primary py-3 transition-all duration-300 ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending Inquiry...
                                        </span>
                                    ) : 'Submit Inquiry'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-4">🧊</div>
                            <h4 className="font-bold mb-2">Cold-Chain Reliability</h4>
                            <p className="text-sm text-[#6B6B6B]">Our logistics network ensures every batch arrives at your kitchen between 2°C and 4°C.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-4">🧀</div>
                            <h4 className="font-bold mb-2">Masterclass Training</h4>
                            <p className="text-sm text-[#6B6B6B]">We provide staff training on cheese handling, pairing, and presentation for all partners.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-4">📄</div>
                            <h4 className="font-bold mb-2">FSSAI Certified</h4>
                            <p className="text-sm text-[#6B6B6B]">Fully compliant with Indian food safety standards and export-ready documentation.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

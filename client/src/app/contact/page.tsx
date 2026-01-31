'use client';
import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target as HTMLFormElement);
        const emailPayload = {
            to: 'technicalhead@achariya.org',
            subject: `New Inquiry from Le Pondicherry Cheese Contact Form`,
            body: `
                Brand: Le Pondicherry Cheese
                From: ${formData.get('name')} (${formData.get('email')})
                Message: ${formData.get('message')}
            `.trim()
        };

        // Simulate API call
        setTimeout(() => {
            console.log('MOCK EMAIL SEND:', emailPayload);
            setStatus('success');
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setStatus('idle'), 5000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <section className="relative py-24 overflow-hidden text-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/images/shop-hero-new.jpg")' }}
                />
                <div className="absolute inset-0 hero-overlay" />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white-prominent" style={{ fontFamily: 'var(--font-heading)' }}>
                        Contact Us
                    </h1>
                    <p className="text-xl text-white-prominent max-w-2xl mx-auto">
                        We'd love to hear from you. Visit our tasting room or reach out online.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Send us a Message</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input name="name" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C9A961]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input name="email" type="email" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C9A961]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Message</label>
                                    <textarea name="message" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C9A961]"></textarea>
                                </div>
                                {status === 'success' && (
                                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200 animate-fade-in shadow-sm">
                                        ✓ Message sent successfully! Our team will reach out to you soon.
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full transition-all duration-300 ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending Message...
                                        </span>
                                    ) : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Our Facility</h2>
                                <p className="text-[#6B6B6B]">
                                    AGOC Food Park, Auroville Road<br />
                                    Pondicherry - 605101, India
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Customer Support</h2>
                                <p className="text-[#6B6B6B]">
                                    Email: hello@lepondycheese.com<br />
                                    Phone: +91 413 2234 567
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

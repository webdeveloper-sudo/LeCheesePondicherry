'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface HomeClientProps {
    featuredProducts: Product[];
    subscriptionPlans: Product[];
    testimonials: any[];
}

export default function HomeClient({ featuredProducts, subscriptionPlans, testimonials }: HomeClientProps) {
    const { addToCart } = useCart();
    const [subscribingId, setSubscribingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    const handleSubscribe = async (planId: string) => {
        setSubscribingId(planId);

        // Find plan details
        const plan = subscriptionPlans.find(p => p.id === planId);

        // Simulate API/Notification lag
        await new Promise(resolve => setTimeout(resolve, 1500));

        const content = `
Brand: Le Pondicherry Cheese
Activity: User clicked Subscribe for ${plan?.name}
Price: ₹${plan?.price}/month
Timestamp: ${new Date().toLocaleString()}
Action: Item added to cart for checkout.
    `.trim();

        // Send Real Email via API
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'technicalhead@achariya.org',
                    subject: `Subscription Interest: ${plan?.name}`,
                    content: content
                }),
            });
        } catch (err) {
            console.error('Email API Error:', err);
        }

        // Add to cart
        if (plan) {
            addToCart(plan.id, 1, plan.weight);
        }

        setSubscribingId(null);
        setSuccessId(planId);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessId(null), 3000);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/images/hero-cheese-board.jpg")' }}
                >
                    <div className="absolute inset-0 hero-overlay" />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-white-prominent" style={{ fontFamily: 'var(--font-heading)' }}>
                        Handcrafted in Pondicherry
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animate-delay-100 text-white-prominent">
                        Experience the fusion of French tradition and Indian craftsmanship
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-200">
                        <Link href="/shop" className="btn btn-primary text-lg px-8 py-4">
                            Discover Our Collection
                        </Link>
                        <Link href="/about" className="btn text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#2C5530] font-semibold">
                            Our Story
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Brand Promise Section */}
            <section className="py-20 bg-[#FAF7F2]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl text-center mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        Where French Heritage Meets Indian Craftsmanship
                    </h2>
                    <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
                        Every wheel of cheese tells a story of patience, passion, and perfection
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Artisan Crafted</h3>
                            <p className="text-[#6B6B6B]">Every wheel aged to perfection by master cheesemakers</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Local Ingredients</h3>
                            <p className="text-[#6B6B6B]">Fresh milk from trusted local farms, supporting our community</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>French Tradition</h3>
                            <p className="text-[#6B6B6B]">Techniques passed down through generations, perfected in Pondicherry</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Discover Our Signature Collection</h2>
                        <p className="text-[#6B6B6B] max-w-2xl mx-auto">Handcrafted cheeses made using traditional French techniques and the finest local ingredients</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.shortDescription}
                                price={product.price}
                                originalPrice={product.originalPrice}
                                image={product.image}
                                rating={product.rating}
                                reviews={product.reviews}
                            />
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/shop" className="btn btn-secondary">View All Cheeses</Link>
                    </div>
                </div>
            </section>

            {/* Cheese Club Subscriptions */}
            <section className="py-20 bg-[#FAF7F2]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                            Never Run Out of Cheese
                        </h2>
                        <p className="text-[#6B6B6B] max-w-2xl mx-auto">
                            Subscribe to our Monthly Cheese Club and receive 3-4 artisan cheeses delivered fresh
                            to your door. Save 15% on every order and discover new flavors each month.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {subscriptionPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`bg-white p-8 rounded-2xl shadow-lg border-2 transition-transform duration-300 hover:-translate-y-2 ${plan.featured ? 'border-[#C9A961] scale-105 relative' : 'border-transparent'}`}
                            >
                                {plan.featured && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A961] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                        Popular
                                    </span>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {plan.name.replace('Cheese Club ', '')}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-4xl font-bold text-[#2C5530]">₹{plan.price.toLocaleString()}</span>
                                        <span className="text-[#6B6B6B]">/month</span>
                                    </div>
                                    <p className="text-sm text-[#888888] mt-2">{plan.shortDescription}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                                        <span className="text-[#C9A961] font-bold">✓</span>
                                        <span>{plan.id === 'sub-explorer' ? '3' : plan.id === 'sub-enthusiast' ? '4' : '5'} curated artisan cheeses</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                                        <span className="text-[#C9A961] font-bold">✓</span>
                                        <span>Temperature-controlled national shipping</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                                        <span className="text-[#C9A961] font-bold">✓</span>
                                        <span>Detailed tasting notes & pairing guides</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    className={`w-full py-4 rounded-lg font-bold transition-all duration-300 ${successId === plan.id
                                        ? 'bg-green-600 text-white'
                                        : plan.featured
                                            ? 'bg-[#C9A961] text-white hover:bg-[#B8942F]'
                                            : 'bg-[#F5E6D3] text-[#2C5530] hover:bg-[#E8D5B8]'
                                        } ${subscribingId === plan.id ? 'opacity-70 cursor-wait' : ''}`}
                                    disabled={subscribingId !== null}
                                >
                                    {subscribingId === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : successId === plan.id ? '✓ Plan Added!' : 'Subscribe'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Teaser Section */}
            <section className="py-20 bg-[#2C5530] text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <p className="text-[#C9A961] uppercase tracking-wider mb-4 font-medium">Our Story</p>
                            <h2 className="text-3xl md:text-4xl mb-6 text-white-prominent" style={{ fontFamily: 'var(--font-heading)' }}>Born from a Dream in Pondicherry</h2>
                            <p className="text-white/90 mb-6 leading-relaxed">
                                Le Pondicherry Cheese was founded with a simple vision: to bring the art of French cheesemaking to
                                the sun-kissed shores of Pondicherry. Our journey began when we discovered that the perfect
                                cheese could only be made with patience, passion, and the finest ingredients.
                            </p>
                            <p className="text-white/90 mb-8 leading-relaxed">
                                Today, our master cheesemakers combine time-honored European techniques with local ingredients
                                to create cheeses that are truly unique to this region.
                            </p>
                            <Link href="/about" className="btn btn-primary">Discover Our Journey</Link>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="aspect-[4/3] bg-[#F5E6D3] rounded-lg overflow-hidden relative">
                                <Image src="/images/cheesemaker.jpg" alt="Cheesemaker" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#F5E6D3]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>What Our Customers Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial: any) => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md">
                                <div className="text-[#C9A961] mb-4">
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-[#C9A961] fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[#1A1A1A] text-lg mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-semibold text-[#1A1A1A]">{testimonial.author}</p>
                                    <p className="text-sm text-[#6B6B6B]">{testimonial.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gift Collections CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-[#2C5530] to-[#3D7343] rounded-2xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-3xl md:text-4xl mb-4 text-white-prominent" style={{ fontFamily: 'var(--font-heading)' }}>The Perfect Gift for Cheese Lovers</h2>
                        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                            Our curated gift collections feature the finest artisan cheeses, paired with premium accompaniments. Perfect for any occasion.
                        </p>
                        <Link href="/gifts" className="btn btn-primary bg-[#C9A961] hover:bg-[#B8942F]">Explore Gift Collections</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

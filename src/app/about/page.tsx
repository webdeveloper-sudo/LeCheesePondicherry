import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story | French Heritage & Indian Craftsmanship',
    description: 'Learn about Le Pondicherry Cheese, founded in 2018. Discover our journey of bringing French cheesemaking traditions to Pondicherry and our HOPE philosophy.',
};

export default function AboutPage() {
    const timeline = [
        { year: '2018', event: 'Le Pondicherry Cheese founded, facility established in Pondicherry' },
        { year: '2019', event: 'First aged cheddar wheels released after 12-month maturation' },
        { year: '2020', event: 'Launched signature Kombucha-Washed Rind, winning regional food awards' },
        { year: '2021', event: 'Expanded product line to 12 varieties, began supplying premium restaurants' },
        { year: '2022', event: 'Introduced subscription boxes and cheese-making workshops' },
        { year: '2023', event: 'Opened tasting room and expanded aging caves' },
        { year: '2024', event: 'Launched e-commerce platform, now shipping pan-India' },
        { year: '2026', event: 'Celebrating 8 years of artisan excellence' },
    ];

    const stats = [
        { number: '8+', label: 'Years of Craftsmanship' },
        { number: '12', label: 'Cheese Varieties' },
        { number: '50+', label: 'Restaurant Partners' },
        { number: '10,000+', label: 'Happy Customers' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/cheesemaker.jpg")' }}
            >
                <div className="absolute inset-0 hero-overlay" />
                <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white-prominent"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Our Story
                    </h1>
                    <p className="text-xl text-white-prominent">
                        Born from a Dream in Pondicherry
                    </p>
                </div>
            </section>

            {/* Origin Story */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className="text-3xl md:text-4xl mb-8 text-center"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Where French Heritage Meets Indian Craftsmanship
                        </h2>

                        <div className="prose prose-lg max-w-none text-[#1A1A1A]">
                            <p className="mb-6 font-medium">
                                Le Pondicherry Cheese was born from a simple dream: to bring the art of French cheesemaking to the
                                sun-kissed shores of Pondicherry. Founded in 2018 by the Achariya Group of Companies (AGOC),
                                our journey began when our founder, inspired by Pondicherry's rich French colonial heritage,
                                envisioned creating authentic artisan cheeses that honor European tradition while celebrating
                                local ingredients.
                            </p>
                            <p className="mb-6">
                                Pondicherry, with its unique blend of French and Indian cultures, provided the perfect setting
                                for our cheese-making venture. The region's temperate climate, access to fresh local milk, and
                                centuries-old connection to French culinary traditions made it an ideal location to craft
                                premium cheeses.
                            </p>
                            <p className="mb-6">
                                Our master cheesemakers trained in traditional French techniques, studying under European
                                artisans before returning to establish our facility in Pondicherry. We combine time-honored
                                methods—hand-ladling curds, natural aging in temperature-controlled caves, and careful
                                affinage—with the finest local ingredients sourced from trusted dairy farms within 50
                                kilometers of our facility.
                            </p>
                            <p>
                                What sets Le Pondicherry Cheese apart is our commitment to authenticity without compromise. We
                                don't take shortcuts. Each wheel of cheese is crafted by hand, aged patiently, and monitored
                                daily by our cheesemakers. Our aged cheddar rests for a minimum of 12 months, developing the
                                complex flavors and crystalline texture that cheese connoisseurs seek.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-[#2C5530] text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <p
                                    className="text-4xl md:text-5xl font-bold text-[#C9A961] mb-2"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {stat.number}
                                </p>
                                <p className="text-white/90">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOPE Philosophy */}
            <section className="py-20 bg-[#FAF7F2]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-[#C9A961] uppercase tracking-wider mb-4 font-medium">Our Philosophy</p>
                        <h2
                            className="text-3xl md:text-4xl mb-8"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            HOPE - Healthy, Organic, Pure, Enriched
                        </h2>
                        <p className="text-[#6B6B6B] text-lg mb-8">
                            As part of the AGOC family, Le Pondy Cheese embodies the HOPE philosophy. Our cheeses are
                            made from milk sourced from farms that practice ethical animal husbandry, free from artificial
                            hormones. We use natural aging processes, minimal additives, and traditional methods that
                            preserve the nutritional integrity of our products.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold text-xl">H</span>
                                </div>
                                <h3 className="font-semibold">Healthy</h3>
                                <p className="text-sm text-[#6B6B6B]">Nutritious, wholesome ingredients</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold text-xl">O</span>
                                </div>
                                <h3 className="font-semibold">Organic</h3>
                                <p className="text-sm text-[#6B6B6B]">Natural, sustainable practices</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold text-xl">P</span>
                                </div>
                                <h3 className="font-semibold">Pure</h3>
                                <p className="text-sm text-[#6B6B6B]">No artificial additives</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-[#2C5530] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold text-xl">E</span>
                                </div>
                                <h3 className="font-semibold">Enriched</h3>
                                <p className="text-sm text-[#6B6B6B]">Value-added nutrition</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2
                        className="text-3xl md:text-4xl mb-12 text-center"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Our Journey
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        {timeline.map((item, i) => (
                            <div key={i} className="flex gap-4 mb-6">
                                <div className="w-20 flex-shrink-0">
                                    <span className="text-lg font-bold text-[#C9A961]">{item.year}</span>
                                </div>
                                <div className="flex-1 pb-6 border-l-2 border-[#C9A961] pl-6 relative">
                                    <div className="absolute left-[-5px] top-1 w-2 h-2 bg-[#C9A961] rounded-full" />
                                    <p className="text-[#6B6B6B]">{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#F5E6D3]">
                <div className="container mx-auto px-4 text-center">
                    <h2
                        className="text-3xl md:text-4xl mb-6"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Experience the Le Pondy Difference
                    </h2>
                    <p className="text-[#6B6B6B] max-w-2xl mx-auto mb-8">
                        Visit our tasting room in Pondicherry or order online to taste the passion
                        and craftsmanship that goes into every wheel of cheese we make.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/shop" className="btn btn-primary">
                            Shop Our Cheeses
                        </Link>
                        <Link href="/contact" className="btn btn-secondary">
                            Visit Our Facility
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

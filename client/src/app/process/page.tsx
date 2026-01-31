import { Link } from 'react-router-dom';

export default function ProcessPage() {
    const steps = [
        {
            title: 'Sourcing the Finest Milk',
            description: 'We source fresh, local milk from trusted farms within 50km of our facility in Pondicherry.',
            icon: '🐄'
        },
        {
            title: 'Hand-Ladling Curds',
            description: 'Our cheesemakers use traditional French methods, hand-ladling curds to preserve the delicate texture.',
            icon: '🥣'
        },
        {
            title: 'Affinage in the Caves',
            description: 'The cheese is aged in temperature-controlled caves, where it develops its unique character and flavor profile.',
            icon: '🏔️'
        },
        {
            title: 'Quality Excellence',
            description: 'Every wheel is inspected and tested before it leaves our facility to ensure it meets our Hope standards.',
            icon: '✨'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <section className="relative py-32 md:py-40 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-[center_top_10%]"
                    style={{ backgroundImage: 'url("/images/process-hero-new.jpg")' }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', color: 'white' }}>
                        The Artisan Process
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                        Discover the journey from farm to table, where time and tradition meet.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                                <div className="text-4xl mb-6">{step.icon}</div>
                                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {step.title}
                                </h3>
                                <p className="text-[#6B6B6B]">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link href="/shop" className="btn btn-primary">
                            Explore the Collection
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

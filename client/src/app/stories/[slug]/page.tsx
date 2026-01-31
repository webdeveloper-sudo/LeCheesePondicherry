"use client";

import { Link, useParams } from "react-router-dom";

export default function StoryDetail() {
    const { slug } = useParams<{ slug: string }>();

    // In a real app, this would fetch from a CMS or data file
    const stories = {
        "art-of-aging": {
            title: 'The Art of Aging: Why Time is Our Most Important Ingredient',
            date: 'May 12, 2024',
            image: '/images/products/aged-cheddar.jpg',
            content: 'Detailed article about the aging process in Pondicherry caves...'
        },
        "french-connection": {
            title: 'Exploring the French Connection: From Normandy to Pondy',
            date: 'April 28, 2024',
            image: '/images/products/classic-brie.jpg',
            content: 'Detailed article about French heritage in cheesemaking...'
        },
        "perfect-pairings": {
            title: 'Perfect Pairings: Cheese and Local Pondicherry Brews',
            date: 'April 15, 2024',
            image: '/images/products/kombucha-rind.jpg',
            content: 'Detailed article about local pairings...'
        }
    };

    const story = slug ? stories[slug as keyof typeof stories] : stories["art-of-aging"];

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Link to="/stories" className="text-[#2C5530] font-bold mb-8 inline-block hover:underline">
                        ← Back to Journal
                    </Link>
                    <img
                        src={story.image}
                        alt={story.title}
                        className="rounded-lg shadow-md mb-10 w-full object-cover aspect-video"
                    />
                    <p className="text-[#C9A961] font-bold uppercase tracking-wider mb-4">{story.date}</p>
                    <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>{story.title}</h1>
                    <div className="prose prose-lg text-[#6B6B6B] leading-relaxed">
                        <p>{story.content}</p>
                        <p>Lately, we have been experimenting with various temperatures and humidity levels to perfectly replicate the conditions of the Auvergne region right here in the Coromandel coast. The results have been spectacular, with our latest batch of aged cheddar developing a depth of character we haven't seen before.</p>
                        <p>Stay tuned for more updates from our master cheesemakers as we continue to push the boundaries of artisan cheese in India.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

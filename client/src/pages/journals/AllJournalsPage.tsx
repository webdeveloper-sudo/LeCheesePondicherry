import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-cheese-board.jpg";
import agedCheddar from "@/assets/images/products/aged-cheddar.jpg";
import classicBrie from "@/assets/images/products/classic-brie.jpg";
import kombuchaRind from "@/assets/images/products/kombucha-rind.jpg";

export default function JournalPage() {
  const stories = [
    {
      id: "art-of-aging",
      title: "The Art of Aging: Why Time is Our Most Important Ingredient",
      excerpt:
        "Deep within our temperature-controlled caves in Pondicherry, thousands of cheese wheels are quietly transforming...",
      date: "May 12, 2024",
      image: agedCheddar,
    },
    {
      id: "french-connection",
      title: "Exploring the French Connection: From Normandy to Pondy",
      excerpt:
        "How our master cheesemakers blended centuries-old European techniques with the unique flavors of local Indian dairy...",
      date: "April 28, 2024",
      image: classicBrie,
    },
    {
      id: "perfect-pairings",
      title: "Perfect Pairings: Cheese and Local Pondicherry Brews",
      excerpt:
        "Discover why our signature sharp cheddar is the perfect companion for locally crafted kombuchas and fruit infusions...",
      date: "April 15, 2024",
      image: kombuchaRind,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section
        className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
            <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white-prominent"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Cheese Journal
          </h1>
          <p className="text-xl text-white-prominent max-w-2xl mx-auto">
            Stories of tradition, recipes, and the artisan life.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${story.image}")` }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-[#C9A961] text-xs font-bold uppercase tracking-wider mb-2">
                    {story.date}
                  </p>
                  <h3
                    className="text-xl font-bold mb-3 group-hover:text-[#2C5530] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {story.title}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm mb-4 leading-relaxed">
                    {story.excerpt}
                  </p>
                  <Link
                    to={`/stories/${story.id}`}
                    className="text-sm font-bold text-[#2C5530] hover:underline"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

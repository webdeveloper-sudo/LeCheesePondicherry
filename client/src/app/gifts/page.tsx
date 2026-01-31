"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function GiftsPage() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleBuyAsGift = (id: string, name: string) => {
    addToCart(id, 1, "Gift Set");
    setAddedId(id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const giftCollections = [
    {
      id: "pondicherry-collection",
      name: "The Pondicherry Collection",
      description:
        "Our signature assortment featuring Aged Cheddar, Classic Brie, and a jar of local fruit preserves.",
      price: 2499,
      image: "/images/products/aged-cheddar.jpg",
    },
    {
      id: "artisan-taster-box",
      name: "Artisan Taster Box",
      description:
        "Five miniature cheese wedges curated for the ultimate tasting experience at home.",
      price: 1899,
      image: "/images/products/classic-brie.jpg",
    },
    {
      id: "connoisseurs-hamper",
      name: "Connoisseur's Hamper",
      description:
        "Our most luxurious gift set including signature fusion cheeses, a wooden cheese board, and artisan crackers.",
      price: 4599,
      image: "/images/products/kombucha-rind.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/gifts-hero-new.jpg")' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)", color: "white" }}
          >
            Gift Collections
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Share the love of artisan cheese with our curated gift sets and
            hampers.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftCollections.map((gift) => (
              <div
                key={gift.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="aspect-square relative bg-white group p-4">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {gift.name}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm mb-4 flex-1">
                    {gift.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-[#2C5530]">
                      ₹{gift.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleBuyAsGift(gift.id, gift.name)}
                      className={`btn ${
                        addedId === gift.id
                          ? "bg-green-600 text-white"
                          : "btn-primary"
                      } text-xs py-2 px-4 transition-colors`}
                    >
                      {addedId === gift.id ? "✓ Added" : "Buy as Gift"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

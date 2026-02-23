import { useState } from "react";
import { useCart } from "@/context/CartContext";
import giftsHeroImage from "@/assets/images/gifts-hero-new.jpg";
import agedCheddar from "@/assets/images/products/aged-cheddar.jpg";
import classicBrie from "@/assets/images/products/classic-brie.jpg";
import kombuchaRind from "@/assets/images/products/kombucha-rind.jpg";
import { MotionContainer } from "./ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

export const GiftItems = () => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleBuyAsGift = (id: string, name: string, price: number) => {
    addToCart(id, 1, "Gift Set", price);
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
      image: agedCheddar,
    },
    {
      id: "artisan-taster-box",
      name: "Artisan Taster Box",
      description:
        "Five miniature cheese wedges curated for the ultimate tasting experience at home.",
      price: 1899,
      image: classicBrie,
    },
    {
      id: "connoisseurs-hamper",
      name: "Connoisseur's Hamper",
      description:
        "Our most luxurious gift set including signature fusion cheeses, a wooden cheese board, and artisan crackers.",
      price: 4599,
      image: kombuchaRind,
    },
  ];
  return (
    <div>
      <section className="py-10">
        <div className="container mx-auto px-4">
          <MotionContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            stagger
          >
            {giftCollections.map((gift) => (
              <motion.div
                key={gift.id}
                variants={fadeUp}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="aspect-square relative bg-white group ">
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
                      onClick={() =>
                        handleBuyAsGift(gift.id, gift.name, gift.price)
                      }
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
              </motion.div>
            ))}
          </MotionContainer>
        </div>
      </section>
    </div>
  );
};

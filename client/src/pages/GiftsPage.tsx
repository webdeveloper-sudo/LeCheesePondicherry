"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import giftsHeroImage from "@/assets/images/gifts-hero-new.jpg";
import agedCheddar from "@/assets/images/products/aged-cheddar.jpg";
import classicBrie from "@/assets/images/products/classic-brie.jpg";
import kombuchaRind from "@/assets/images/products/kombucha-rind.jpg";
import { GiftItems } from "@/components/GiftItems";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-pattern">
      <section className="relative py-24 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${giftsHeroImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <MotionContainer
          className="container mx-auto px-4 text-center relative z-10"
          stagger
        >
          <MotionHeading
            as="h1"
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-heading)", color: "white" }}
          >
            Gift Collections
          </MotionHeading>
          <MotionText className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Share the love of artisan cheese with our curated gift sets and
            hampers.
          </MotionText>
        </MotionContainer>
      </section>

      <section>
        <GiftItems />
      </section>
    </div>
  );
}

"use client";

import { useUserStore } from "@/store/useUserStore";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Heart } from "lucide-react";

import { MotionContainer } from "./ui/MotionPrimitives";

interface YourPicksProps {
  title?: string;
  showAllRows?: boolean;
}

export default function YourPicks({
  title,
  showAllRows = true,
}: YourPicksProps) {
  const { preferences, wishlistIds = [] } = useUserStore();
  console.log(wishlistIds);
  const { items: cartItems } = useCart();

  // 1. Top Picks based on preferences
  console.log("YourPicks: Current preferences from store:", preferences);
  const recommendedProducts = (preferences || [])
    .map((pref: any) =>
      products.find((p) => p.id === (pref.productId || pref.id || pref)),
    )
    .filter(Boolean)
    .slice(0, 4);
  console.log("YourPicks: Mapped recommended products:", recommendedProducts);

  // 2. From Your Cart
  const cartProducts = cartItems
    .map((item) => products.find((p) => p.id === item.productId))
    .filter(Boolean)
    .slice(0, 4);

  // 3. Your Wishlist
  const wishlistProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const combinedProducts = [...cartProducts, ...wishlistProducts];

  const Section = ({
    title,
    icon: Icon,
    items,
    emptyText,
    linkTo,
    linkText,
  }: any) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F5E6D3] rounded-lg text-[#2C5530]">
            <Icon size={20} />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] font-heading">
            {title}
          </h2>
        </div>
        {items.length > 0 && linkTo && (
          <Link
            to={linkTo}
            className="text-[#2C5530] font-semibold hover:underline text-sm"
          >
            {linkText}
          </Link>
        )}
      </div>

      {items.length > 0 ? (
        <MotionContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger
        >
          {items.map((product: any) => (
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
        </MotionContainer>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400">{emptyText}</p>
          {linkTo && (
            <Link
              to={linkTo}
              className="inline-block mt-4 btn btn-secondary py-2 px-6 text-sm"
            >
              {linkText}
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        {title && (
          <h1 className="text-3xl font-bold mb-10 text-center font-heading">
            {title}
          </h1>
        )}

        {/* Row 1: Top Picks */}
        <Section
          title="Top Picks for You"
          icon={Star}
          items={recommendedProducts}
          emptyText="Update your preferences to see personalized matches."
          linkTo="/shop"
          linkText="Explore Shop"
        />

        {showAllRows && (
          <>
            {/* Row 2: From Your Cart */}
            {cartProducts.length > 3 && (
              <Section
                title="From Your Cart"
                icon={ShoppingBag}
                items={cartProducts}
                emptyText="Your cart is waiting for some delicious cheese."
                linkTo="/cart"
                linkText="View Full Cart"
              />
            )}

            {/* Row 3: Your Wishlist */}
            {wishlistProducts.length > 3 && (
              <Section
                title="Your Wishlist"
                icon={Heart}
                items={wishlistProducts}
                emptyText="Save your favorites here for later."
                linkTo="/wishlist"
                linkText="View Wishlist"
              />
            )}
            {/* combined one from wish list and cart list */}
            {combinedProducts.length > 0 &&
              cartProducts.length <= 3 &&
              wishlistProducts.length <= 3 && (
                <Section
                  title="More from Your Cart and Wishlist"
                  icon={Heart}
                  items={combinedProducts}
                  emptyText="Save your favorites here for later."
                  linkTo="/cart"
                  linkText="View Full Cart"
                />
              )}
          </>
        )}
      </div>
    </section>
  );
}

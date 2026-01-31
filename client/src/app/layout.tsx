import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lepondicheese.com"),
  title: {
    default: "Le Pondicherry Cheese | Handcrafted Artisan Cheese",
    template: "%s | Le Pondicherry Cheese",
  },
  description:
    "Premium artisan cheeses handcrafted in Pondicherry, inspired by French tradition. Discover our aged cheddars, fresh mozzarella, and unique fusion flavors.",
  keywords: [
    "artisan cheese India",
    "Pondicherry cheese",
    "gourmet cheese",
    "Le Pondicherry",
    "premium cheese online",
    "French cheese India",
  ],
  authors: [{ name: "Le Pondicherry Cheese" }],
  creator: "Le Pondicherry Cheese",
  publisher: "Le Pondicherry Cheese",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Le Pondicherry Cheese | Handcrafted Artisan Cheese",
    description:
      "Premium artisan cheeses handcrafted in Pondicherry, inspired by French tradition.",
    url: "https://lepondicheese.com",
    siteName: "Le Pondicherry Cheese",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Le Pondicherry Cheese Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Pondicherry Cheese | Handcrafted Artisan Cheese",
    description:
      "Premium artisan cheeses handcrafted in Pondicherry, inspired by French tradition.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo.jpg", sizes: "32x32", type: "image/jpeg" },
    ],
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Le Pondicherry Cheese",
  url: "https://lepondicheese.com",
  logo: "https://lepondicheese.com/images/logo.jpg",
  description: "Handcrafted artisan cheese from Pondicherry, India.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Marie Oulgaret",
    addressLocality: "Pondicherry",
    postalCode: "605111",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9150121331",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <CartProvider>
          <FlashSaleBanner />
          <Header />
          <main>{children}</main>
          <ChatBot />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

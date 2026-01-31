import FlashSaleBanner from "@/components/FlashSaleBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import { CartProvider } from "@/context/CartContext";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/app/about/page";
import ShopPage from "@/app/shop/page";
import CartPage from "@/app/cart/page";
import CheckoutPage from "@/app/checkout/page";
import ContactPage from "@/app/contact/page";
import FaqPage from "@/app/faq/page";
import GiftsPage from "@/app/gifts/page";
import PrivacyPage from "@/app/privacy/page";
import ProcessPage from "@/app/process/page";
import ProductPage from "@/app/products/[slug]/page";
import ShippingPage from "@/app/shipping/page";
import StoriesPage from "@/app/stories/page";
import StoryDetail from "@/app/stories/[slug]/page";
import TermsPage from "@/app/terms/page";
import UserLoginPage from "@/app/user/login/page";
import UserDashboardPage from "@/app/user/page";
import WholesalePage from "@/app/wholesale/page";
import DummyPage from "@/app/dummy/page";
import GiftsShopPage from "@/app/gifts/page";

import WishlistPage from "@/app/wishlist/page";
import EditUserProfile from "./pages/user/EditUserProfile";
import AllBlogs from "./pages/blogs/AllBlogs";
import SingleBlogDetails from "./pages/blogs/SingleBlogDetails";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      {!isAdminPath && (
        <div className="mb-[145px]">
          <Header />
        </div>
      )}
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/gifts" element={<GiftsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/stories" element={<AllBlogs />} />
          <Route path="/stories/:slug" element={<SingleBlogDetails />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/user/login" element={<UserLoginPage />} />
          <Route path="/wholesale" element={<WholesalePage />} />
          <Route path="/user" element={<UserDashboardPage />} />
          <Route path="/user/editprofile" element={<EditUserProfile />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/dummy" element={<DummyPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          {/* Gifts landing and other legacy routes can be mapped here if needed */}
        </Routes>
      </main>
      {!isAdminPath && (
        <>
          <ChatBot />
          <Footer />
        </>
      )}
    </CartProvider>
  );
}

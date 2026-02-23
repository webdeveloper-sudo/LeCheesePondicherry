import FlashSaleBanner from "@/components/FlashSaleBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import DecorativeWrapper from "@/components/DecorativeWrapper";
import { CartProvider } from "@/context/CartContext";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ShopPage from "@/pages/products/AllProductsShopPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ContactPage from "@/pages/Contact";
import FaqPage from "@/pages/FaqPage";
import GiftsPage from "@/pages/GiftsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProcessPage from "@/pages/ProcessPage";
import ProductPage from "@/pages/products/SingleProductPage";
import ShippingPage from "@/app/shipping/page";
import TermsPage from "@/app/terms/page";
import UserLoginPage from "@/app/user/login/page";
import UserDashboardPage from "@/app/user/page";
import WholesalePage from "@/app/wholesale/page";
import DummyPage from "@/app/dummy/page";

import WishlistPage from "@/pages/WishListPage";
import EditUserProfile from "./pages/user/EditUserProfile";
import AllBlogs from "./pages/blogs/AllBlogs";
import SingleBlogDetails from "./pages/blogs/SingleBlogDetails";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import YourOrders from "./pages/user/YourOrders";

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
            <Route path="/checkout/status" element={<OrderStatusPage />} />
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
            <Route path="/orders" element={<YourOrders />} />
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

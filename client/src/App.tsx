import { useState, useEffect } from "react";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import DecorativeWrapper from "@/components/DecorativeWrapper";
import LoaderComponent from "@/components/Loader";
import ToastContainer from "@/components/ToastContainer";
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
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import TermsPage from "@/pages/TermsPage";
import UserLoginPage from "@/app/user/login/page";
import UserDashboardPage from "@/app/user/page";
import WholesalePage from "@/pages/WholeSale";
import DummyPage from "@/app/dummy/page";

import WishlistPage from "@/pages/WishListPage";
import EditUserProfile from "./pages/user/EditUserProfile";
import AllBlogs from "./pages/blogs/AllBlogs";
import SingleBlogDetails from "./pages/blogs/SingleBlogDetails";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import YourOrders from "./pages/user/YourOrders";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    setIsRouting(true);
    const timer = setTimeout(() => {
      setIsRouting(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <CartProvider>
      {/* {isRouting && <LoaderComponent fullScreen={true} size="lg" label="Loading..." />} */}
      {!isAdminPath && (
        <div className="mb-[110px] sm:mb-[130px] md:mb-[145px]">
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
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
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
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Gifts landing and other legacy routes can be mapped here if needed */}
        </Routes>
      </main>
      {!isAdminPath && (
        <>
          <ChatBot />
          <Footer />
        </>
      )}
      <ToastContainer />
    </CartProvider>
  );
}

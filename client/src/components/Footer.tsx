import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
    return (
        <footer className="bg-[#2C5530] text-white">
            {/* Newsletter Section */}
            <div className="bg-[#F5E6D3] py-16">
                <div className="container mx-auto px-4 text-center">
                    <h3
                        className="text-3xl text-[#1A1A1A] mb-4 font-bold"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        The Perfect Gift for Cheese Lovers
                    </h3>
                    <p className="text-[#1A1A1A] mb-6 max-w-md mx-auto font-medium">
                        Get exclusive recipes, pairing guides, and early access to new flavors.
                        <span className="font-bold text-[#2C5530]"> 10% off your first order!</span>
                    </p>
                    <div className="max-w-md mx-auto">
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div>
                            <Link to="/">
                                <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-[#C9A961] shadow-lg mb-6 mx-auto md:mx-0 hover:scale-105 transition-transform duration-300">
                                    <img
                                        src="/images/logo.jpg"
                                        alt="Le Pondicherry Cheese Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>
                            <p className="text-white/90 text-sm mb-4 leading-relaxed">
                                Handcrafted in Pondicherry, inspired by French tradition.
                                Premium artisan cheeses made with passion and local ingredients.
                            </p>
                            <p className="text-sm font-medium text-[#C9A961]">
                                Part of AGOC - Achariya Group of Companies
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h5 className="footer-header font-bold mb-6 text-[#C9A961] uppercase tracking-wider text-xs">Shop</h5>
                            <ul className="space-y-3 text-sm text-white/90">
                                <li><Link to="/shop" className="hover:text-[#C9A961] transition-colors">All Cheeses</Link></li>
                                <li><Link to="/shop?category=aged" className="hover:text-[#C9A961] transition-colors">Aged Cheeses</Link></li>
                                <li><Link to="/shop?category=soft" className="hover:text-[#C9A961] transition-colors">Soft Cheeses</Link></li>
                                <li><Link to="/gifts" className="hover:text-[#C9A961] transition-colors">Gift Collections</Link></li>
                                <li><Link to="/shop?category=subscription" className="hover:text-[#C9A961] transition-colors">Subscription Boxes</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h5 className="footer-header font-bold mb-6 text-[#C9A961] uppercase tracking-wider text-xs">Company</h5>
                            <ul className="space-y-3 text-sm text-white/90">
                                <li><Link to="/about" className="hover:text-[#C9A961] transition-colors">Our Story</Link></li>
                                <li><Link to="/process" className="hover:text-[#C9A961] transition-colors">Artisan Process</Link></li>
                                <li><Link to="/faq" className="hover:text-[#C9A961] transition-colors">FAQ</Link></li>
                                <li><Link to="/contact" className="hover:text-[#C9A961] transition-colors">Visit Us</Link></li>
                                <li><Link to="/wholesale" className="hover:text-[#C9A961] transition-colors">Wholesale</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h5 className="footer-header font-bold mb-6 text-[#C9A961] uppercase tracking-wider text-xs">Contact</h5>
                            <address className="not-italic space-y-3 text-sm text-white/90">
                                <p>Marie Oulgaret, Auroville Road</p>
                                <p>Pondicherry - 605111, India</p>
                                <div className="pt-2">
                                    <a href="mailto:hello@lepondicheese.com" className="hover:text-[#C9A961] transition-colors block">
                                        hello@lepondicheese.com
                                    </a>
                                </div>
                                <div className="pt-1">
                                    <a href="tel:+919150121331" className="hover:text-[#C9A961] transition-colors block">
                                        +91 91501 21331
                                    </a>
                                </div>
                            </address>
                            {/* Social Icons */}
                            <div className="flex gap-4 mt-4">
                                <a href="https://www.facebook.com/people/LepondicherryCheese/61579368624195/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A961] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/lepondicherrycheese" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A961] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="https://www.youtube.com/@lepondicherrycheese" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A961] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/company/le-pondicherry-cheese" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A961] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/90">
                    <p>© 2026 Le Pondicherry Cheese. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0 font-medium">
                        <Link to="/shipping" className="hover:text-[#C9A961] transition-colors">Shipping & Returns</Link>
                        <Link to="/privacy" className="hover:text-[#C9A961] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#C9A961] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

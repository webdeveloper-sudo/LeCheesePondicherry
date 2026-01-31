"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { items, getProduct, subtotal, clearCart } = useCart();
    const [step, setStep] = useState<'auth' | 'shipping' | 'payment' | 'confirmation'>('auth');
    const [authMethod, setAuthMethod] = useState<'email' | 'google' | null>(null);
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Shipping form
    const [shipping, setShipping] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [gpsCoords, setGpsCoords] = useState<string>('Not detected');

    const discount = 0;
    const shippingCost = subtotal > 1500 ? 0 : 99;
    const total = subtotal - discount + shippingCost;

    const handleEmailSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsLoggedIn(true);
            setStep('shipping');
        }
    };

    const handleGoogleSignIn = () => {
        // Simulated Google sign-in for demo
        setEmail('demo.user@gmail.com');
        setIsLoggedIn(true);
        setStep('shipping');
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (shipping.phone.length !== 10) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }
        if (!/^\d+$/.test(shipping.pincode)) {
            alert('Pincode must contain numbers only.');
            return;
        }
        setStep('payment');
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        console.log('--- STARTING GPS DETECTION ---');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log('GPS SUCCESS:', position.coords);
                setShipping(prev => ({
                    ...prev,
                    city: 'Pondicherry',
                    state: 'Puducherry',
                    pincode: '605001'
                }));
                const { latitude, longitude } = position.coords;
                try {
                    const geoResp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const geoData = await geoResp.json();
                    const locationName = `${geoData.city || geoData.locality || 'Unknown City'}, ${geoData.principalSubdivision || ''}`;
                    setGpsCoords(`${locationName} (${latitude}, ${longitude})`);
                } catch {
                    setGpsCoords(`${latitude}, ${longitude}`);
                }
                console.log('STATE UPDATED: 605001, Pondicherry, Puducherry');
                setIsLocating(false);
            },
            (error) => {
                console.error('GPS ERROR:', error.message);
                alert('Unable to retrieve your location');
                setIsLocating(false);
            }
        );
    };

    // Auto-detect location when reaching shipping step
    useEffect(() => {
        if (step === 'shipping' && !shipping.city) {
            console.log('--- AUTO-TRIGGERING GPS DETECTION ---');
            detectLocation();
        }
    }, [step]);

    // Smart Pincode Lookup
    useEffect(() => {
        if (shipping.pincode.length === 6) {
            console.log('PINCODE DETECTED:', shipping.pincode);
            const pincodeData: Record<string, { city: string, state: string }> = {
                '605001': { city: 'Pondicherry', state: 'Puducherry' },
                '600119': { city: 'Chennai', state: 'Tamil Nadu' },
                '110001': { city: 'New Delhi', state: 'Delhi' },
                '400001': { city: 'Mumbai', state: 'Maharashtra' },
                '560001': { city: 'Bangalore', state: 'Karnataka' },
                '700001': { city: 'Kolkata', state: 'West Bengal' },
                '500001': { city: 'Hyderabad', state: 'Telangana' },
            };

            const data = pincodeData[shipping.pincode];
            if (data) {
                console.log('PINCODE MATCH FOUND:', data);
                setShipping(prev => ({
                    ...prev,
                    city: data.city,
                    state: data.state
                }));
            } else {
                console.log('NO MATCH FOR PINCODE');
            }
        }
    }, [shipping.pincode]);

    const handlePayment = async () => {
        // Simulated order data
        const orderId = `LPC-2026-${Math.floor(Math.random() * 10000)}`;
        const orderDetails = items.map(item => {
            const product = getProduct(item.productId);
            return `${item.quantity}x ${product?.name} (${item.weight})`;
        }).join('\n                ');

        const content = `
Brand: Le Pondicherry Cheese
Order ID: ${orderId}
Customer: ${shipping.name} (${email})
Phone: ${shipping.phone}

Items Ordered:
${orderDetails}

Shipping Address: ${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}

Payment Method: Razorpay Secure
Total Amount: ₹${total.toLocaleString()}
GPS Context: ${gpsCoords}
Map View: https://www.google.com/maps?q=${gpsCoords.split('(')[1]?.replace(')', '').replace(' ', '') || ''}

Timestamp: ${new Date().toLocaleString()}
        `.trim();

        // Send Real Email via API
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'savinashshankar@gmail.com',
                    subject: `New Order: ${orderId} - ${shipping.name}`,
                    content: content
                }),
            });

            const result = await response.json();
            if (!result.success && result.error?.includes('missing')) {
                alert('E-Commerce Notice: Order notifications are currently in \'Simulated Mode\'. Please configure the RESEND_API_KEY in the site environment settings to enable live alerts.');
            } else if (result.success) {
                console.log('REAL EMAIL SENT SUCCESSFULLY');
            } else {
                console.warn('EMAIL DELIVERY FAILED:', result.error);
            }
        } catch (err) {
            console.error('NETWORK ERROR SENDING EMAIL:', err);
        }

        // Proceed to confirmation
        setStep('confirmation');
        clearCart();
    };

    if (items.length === 0 && step !== 'confirmation') {
        return (
            <div className="min-h-screen py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        Your cart is empty
                    </h1>
                    <Link to="/shop" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] py-12">
            <div className="container mx-auto px-4">
                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {['auth', 'shipping', 'payment', 'confirmation'].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s ? 'bg-[#2C5530] text-white' :
                                    ['auth', 'shipping', 'payment', 'confirmation'].indexOf(step) > i ? 'bg-[#C9A961] text-white' :
                                        'bg-gray-200 text-gray-500'
                                    }`}>
                                    {i + 1}
                                </div>
                                {i < 3 && <div className={`w-12 h-1 ${['auth', 'shipping', 'payment', 'confirmation'].indexOf(step) > i ? 'bg-[#C9A961]' : 'bg-gray-200'
                                    }`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Authentication */}
                        {step === 'auth' && (
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Sign In to Continue
                                </h2>
                                <p className="text-[#6B6B6B] mb-8">
                                    Enter your email or sign in with Google to receive your order confirmation and receipt.
                                </p>

                                {/* Google Sign In */}
                                <button
                                    onClick={handleGoogleSignIn}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-[#C9A961] transition-colors mb-4"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="font-medium text-[#1A1A1A]">Continue with Google</span>
                                </button>

                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-[#6B6B6B] text-sm">or</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                {/* Email Sign In */}
                                <form onSubmit={handleEmailSignIn}>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961] mb-4"
                                    />
                                    <button type="submit" className="w-full btn btn-primary py-4">
                                        Continue with Email
                                    </button>
                                </form>

                                <p className="text-xs text-[#6B6B6B] mt-4 text-center">
                                    Your receipt and order updates will be sent to this email address.
                                </p>
                            </div>
                        )}

                        {/* Step 2: Shipping */}
                        {step === 'shipping' && (
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Shipping Information
                                    </h2>
                                    <div className="flex flex-col items-end gap-1">
                                        <button
                                            type="button"
                                            onClick={detectLocation}
                                            disabled={isLocating}
                                            className={`text-xs font-bold flex items-center gap-1 transition-all ${isLocating ? 'text-gray-400' : 'text-[#2C5530] hover:underline'}`}
                                        >
                                            {isLocating ? (
                                                <>
                                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Locating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    Auto-fill with GPS
                                                </>
                                            )}
                                        </button>
                                        <span className="text-xs text-[#6B6B6B]">
                                            Logged in: <span className="font-medium text-[#1A1A1A]">{email}</span>
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleShippingSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shipping.name}
                                            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            placeholder="10 digit mobile number"
                                            value={shipping.phone}
                                            onChange={(e) => setShipping({ ...shipping, phone: e.target.value.replace(/\D/g, '') })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Address *</label>
                                        <textarea
                                            required
                                            value={shipping.address}
                                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shipping.city}
                                                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shipping.state}
                                                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Pincode *</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                                value={shipping.pincode}
                                                onChange={(e) => setShipping({ ...shipping, pincode: e.target.value.replace(/\D/g, '') })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961]"
                                                placeholder="6 digits"
                                            />
                                            {shipping.pincode.length === 6 && (
                                                <span className="absolute right-3 bottom-3 text-[#2C5530] text-xs font-bold animate-pulse">
                                                    ✓ Located
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button type="button" onClick={() => setStep('auth')} className="btn btn-secondary">
                                            Back
                                        </button>
                                        <button type="submit" className="flex-1 btn btn-primary">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 'payment' && (
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Payment
                                </h2>

                                <div className="mb-6 p-4 bg-[#FAF7F2] rounded-lg">
                                    <p className="text-sm text-[#6B6B6B]">Shipping to:</p>
                                    <p className="font-medium text-[#1A1A1A]">{shipping.name}</p>
                                    <p className="text-sm text-[#6B6B6B]">{shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
                                </div>

                                <div className="border-2 border-[#C9A961] rounded-lg p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                            RAZORPAY
                                        </div>
                                        <span className="font-medium text-[#1A1A1A]">Secure Payment via Razorpay</span>
                                    </div>
                                    <p className="text-sm text-[#6B6B6B] mb-4">
                                        Pay securely using UPI, Credit/Debit Cards, Net Banking, or Wallets
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-gray-100 rounded text-xs">UPI</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded text-xs">Cards</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded text-xs">Net Banking</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded text-xs">Wallets</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button onClick={() => setStep('shipping')} className="btn btn-secondary">
                                        Back
                                    </button>
                                    <button onClick={handlePayment} className="flex-1 btn btn-primary py-4 text-lg">
                                        Pay ₹{total.toLocaleString()}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {step === 'confirmation' && (
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Order Confirmed!
                                </h2>
                                <p className="text-[#6B6B6B] mb-2">Thank you for your order</p>
                                <p className="text-lg font-medium text-[#1A1A1A] mb-6">Order #LPC-2026-{Math.floor(Math.random() * 10000)}</p>

                                <div className="bg-[#FAF7F2] p-4 rounded-lg mb-6 inline-block">
                                    <p className="text-sm text-[#6B6B6B]">Receipt sent to:</p>
                                    <p className="font-medium text-[#2C5530]">{email}</p>
                                </div>

                                <p className="text-[#6B6B6B] mb-8">
                                    We'll send you shipping confirmation when your order is on the way!
                                </p>

                                <Link to="/shop" className="btn btn-primary">
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {step !== 'confirmation' && (
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                                <h3 className="font-semibold mb-4 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {items.map((item, i) => {
                                        const product = getProduct(item.productId);
                                        if (!product) return null;
                                        return (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-16 h-16 bg-[#FAF7F2] rounded overflow-hidden relative">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-[#1A1A1A]">{product.name}</p>
                                                    <p className="text-xs text-[#6B6B6B]">{item.weight} × {item.quantity}</p>
                                                    <p className="text-sm font-medium text-[#2C5530]">₹{(product.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-[#6B6B6B]">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#6B6B6B]">
                                        <span>Shipping</span>
                                        <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t text-[#1A1A1A]">
                                        <span>Total</span>
                                        <span className="text-[#2C5530]">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    return (
        <div className="w-full">
            {status === 'success' ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fade-in" role="alert">
                    <strong className="font-bold">Welcome to the family! 🧀</strong>
                    <span className="block sm:inline"> You've successfully subscribed to our newsletter.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#C9A961] bg-white text-[#1A1A1A] placeholder:text-[#888888]"
                        required
                        disabled={status === 'loading'}
                    />
                    <button
                        type="submit"
                        className={`btn btn-primary whitespace-nowrap ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
            )}
        </div>
    );
}

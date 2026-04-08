'use client';

import { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading'>('idle');
    const { addToast } = useToastStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            addToast("Welcome to the family! 🧀 You've successfully subscribed to our newsletter.", "success");
            setEmail('');
            setStatus('idle');
        }, 1500);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-brand-gold-subtle bg-white text-text-primary placeholder:text-text-secondary"
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
        </div>
    );
}

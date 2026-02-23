'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { findBestMatch } from '@/data/chatbot-knowledge';
import { logChatInteraction, generateSessionId } from '@/utils/chatAnalytics';
import { products } from '@/data/products';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot', suggestions?: string[] }[]>([
        {
            text: "Namaste! I'm your Le Pondicherry Cheese assistant. How can I help you today?",
            sender: 'bot',
            suggestions: ["Our Story", "Shipping Info", "Top Products"]
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [fallbackStep, setFallbackStep] = useState<'none' | 'name' | 'email'>('none');
    const [pendingQuery, setPendingQuery] = useState('');
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [userLocation, setUserLocation] = useState<string>('Requesting...');
    const [sessionId] = useState(() => generateSessionId());
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = async (query?: string) => {
        const text = query || inputValue;
        if (!text.trim()) return;

        // If in fallback mode, handle user data capture
        if (fallbackStep !== 'none') {
            if (fallbackStep === 'name') {
                setUserData({ ...userData, name: text });
                setMessages([{ text: `Great! Thanks ${text}. And what is your email address so we can reply?`, sender: 'bot' }, { text, sender: 'user' }, ...messages]);
                setFallbackStep('email');
                setInputValue('');
                return;
            } else if (fallbackStep === 'email') {
                setUserData({ ...userData, email: text });
                setMessages([
                    {
                        text: "Perfect. I've sent your request to our team. We'll be in touch very soon! Is there anything else I can help you with in the meantime?",
                        sender: 'bot',
                        suggestions: ["That's it, thanks!", "Top Products", "Shop Now"]
                    },
                    { text, sender: 'user' },
                    ...messages
                ]);
                setFallbackStep('none');
                setInputValue('');

                // FINAL ACTION: Send full history with user details to email
                const fullHistory = [{ text, sender: 'user' }, ...messages].reverse().map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
                try {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: 'savinashshankar@gmail.com',
                            subject: `Urgent: Unresolved Chat Inquiry from ${userData.name}`,
                            content: `
User Details:
Name: ${userData.name}
Email: ${text}
Location: ${userLocation}
Map Link: https://www.google.com/maps?q=${userLocation.match(/(-?\d+\.\d+)/g)?.join(',') || ''}

Original Query: ${pendingQuery}

Full Chat History:
${fullHistory}

Action Required: Please reply to ${text} as soon as possible.
                            `.trim()
                        }),
                    });
                    const result = await response.json();
                    if (!result.success) {
                        console.warn('EMAIL NOT SENT:', result.error);
                        alert(`E-Commerce Notice: Support escalation is currently in 'Simulated Mode'. To enable live email alerts, please configure the RESEND_API_KEY in the site environment settings.`);
                    }
                } catch (err) {
                    console.error('FAILED TO SEND ESCALATION EMAIL:', err);
                }
                return;
            }
        }

        // Standard message handling
        const newMessages = [{ text, sender: 'user' as const }, ...messages];
        setMessages(newMessages);
        setInputValue('');
        setIsThinking(true);

        // Simulation delay
        setTimeout(async () => {
            const match = findBestMatch(text);
            let botText = "";

            if (match) {
                botText = match.answer;
                setMessages(prev => [
                    {
                        text: match.answer,
                        sender: 'bot',
                        suggestions: match.suggestions
                    },
                    ...prev
                ]);
            } else {
                // START FALLBACK: Seek user info
                botText = "I've taken up your query internally, and our team shall revert to you shortly. To help us follow up, could you please tell me your Full Name?";
                setPendingQuery(text);
                setFallbackStep('name');

                // Trigger location capture silently
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            try {
                                const geoResp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                                const geoData = await geoResp.json();
                                const locationName = `${geoData.city || geoData.locality || 'Unknown City'}, ${geoData.principalSubdivision || geoData.countryName || ''}`;
                                setUserLocation(`${locationName} (${latitude}, ${longitude})`);
                            } catch {
                                setUserLocation(`${latitude}, ${longitude}`);
                            }
                        },
                        () => setUserLocation('Permission denied or unavailable'),
                        { timeout: 5000 }
                    );
                }

                setMessages(prev => [
                    {
                        text: botText,
                        sender: 'bot'
                    },
                    ...prev
                ]);
            }

            // Log Interaction for Analytics
            const mentioned = products.filter(p =>
                text.toLowerCase().includes(p.name.toLowerCase()) ||
                botText.toLowerCase().includes(p.name.toLowerCase())
            ).map(p => p.name);

            logChatInteraction({
                timestamp: new Date().toISOString(),
                sessionId,
                userQuery: text,
                botResponse: botText,
                userLocation,
                userName: userData.name || undefined,
                userEmail: userData.email || undefined,
                productsMentioned: mentioned.length > 0 ? mentioned : undefined
            });

            setIsThinking(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-[#2C5530] p-4 text-white flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#FAB519] rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                                LPC
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-white" style={{ color: '#FFFFFF' }}>Cheese Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-white/90">Online | AI Guide</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-all text-white/80 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Container - Inverted List */}
                    <div
                        className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 bg-[#FAF7F2]"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className="space-y-2">
                                <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${m.sender === 'user'
                                        ? 'bg-[#FAB519] text-[#1D161A] rounded-tr-none'
                                        : 'bg-white text-[#1A1A1A] rounded-tl-none border border-gray-100'
                                        }`}>
                                        {m.text.split(/(\[.*?\]\(.*?\))/g).map((part, idx) => {
                                            const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                            if (match) {
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={match[2]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#2C5530] font-bold underline hover:text-[#FAB519] transition-colors"
                                                    >
                                                        {match[1]}
                                                    </a>
                                                );
                                            }
                                            return part;
                                        })}
                                    </div>
                                </div>

                                {/* Suggestions (Quick Replies) */}
                                {m.sender === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {m.suggestions.slice(0, 3).map((s, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(s)}
                                                className="text-[11px] px-3 py-1.5 bg-white border border-[#FAB519]/30 text-[#2C5530] rounded-full hover:bg-[#FAB519] hover:text-white transition-all shadow-sm font-medium"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about our cheese or shipping..."
                                className="flex-1 text-sm bg-gray-50 border border-transparent rounded-full px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-[#2C5530]/10 focus:border-[#2C5530]/20 outline-none transition-all"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim()}
                                className="bg-[#2C5530] text-white p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2C5530]/20 disabled:opacity-50 disabled:scale-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2">Le Pondicherry Cheese Support Portal</p>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#2C5530] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:rotate-12 transition-all group relative"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
}

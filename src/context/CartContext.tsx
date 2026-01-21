'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products, Product } from '@/data/products';

export interface CartItem {
    productId: string;
    quantity: number;
    weight: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (productId: string, quantity: number, weight: string) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearCart: () => void;
    getProduct: (id: string) => Product | undefined;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('lepondy-cart');
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('lepondy-cart', JSON.stringify(items));
        }
    }, [items, mounted]);

    const getProduct = (id: string) => products.find(p => p.id === id);

    const addToCart = (productId: string, quantity: number, weight: string) => {
        setItems(prev => {
            // Check if item already exists with same weight
            const existingIndex = prev.findIndex(
                item => item.productId === productId && item.weight === weight
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }

            return [...prev, { productId, quantity, weight }];
        });
    };

    const removeFromCart = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(index);
            return;
        }
        setItems(prev => {
            const updated = [...prev];
            updated[index].quantity = quantity;
            return updated;
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product?.price || 0) * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getProduct,
            totalItems,
            subtotal,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

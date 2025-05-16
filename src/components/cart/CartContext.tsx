"use client";
import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  issue_number?: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  updateQuantity: (id: number | string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // If the cart was just cleared, localStorage may not be in sync yet. Always use prev.
      const exists = prev.find(i => i.id === item.id);
      let updated;
      if (exists) {
        updated = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      saveCart(updated);
      return updated;
    });
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i);
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (id: number | string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

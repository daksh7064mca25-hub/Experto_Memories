"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { OrderItem } from "@/types/order";

interface CartContextType {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productSlug: string) => void;
  updateTheme: (productSlug: string, selectedTheme: string) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "expertomemories_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load cart from storage:", e);
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("Failed to persist cart:", e);
      }
    }
  }, [items, mounted]);

  const addItem = (item: Omit<OrderItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productSlug === item.productSlug);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          selectedTheme: item.selectedTheme,
          quantity: (updated[existingIndex].quantity || 1) + (item.quantity || 1),
        };
        return updated;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productSlug: string) => {
    setItems((prev) => prev.filter((i) => i.productSlug !== productSlug));
  };

  const updateTheme = (productSlug: string, selectedTheme: string) => {
    setItems((prev) =>
      prev.map((i) => (i.productSlug === productSlug ? { ...i, selectedTheme } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateTheme,
        clearCart,
        totalAmount,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

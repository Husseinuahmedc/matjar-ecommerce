"use client";

import React, { createContext, useContext, useState } from "react";

interface CartProductData {
  titleAr: string;
  titleEn: string;
  price: number;
  images: { url: string }[];
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: {
    titleAr: string;
    titleEn: string;
    images: { url: string }[];
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (productId: string, quantity: number, productData?: CartProductData) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  isPending: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matjar_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPending] = useState(false);

  const saveToLocalStorage = (newItems: CartItem[]) => {
    localStorage.setItem("matjar_cart", JSON.stringify(newItems));
  };

  const addItem = async (productId: string, quantity: number, productData?: CartProductData) => {
    const newItems = [...items];
    const existing = newItems.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else if (productData) {
      newItems.push({
        id: `temp-${Date.now()}`,
        productId,
        quantity,
        unitPrice: productData.price,
        product: productData,
      });
    }
    setItems(newItems);
    saveToLocalStorage(newItems);
    setIsOpen(true);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const newItems = items.map(i => i.id === id ? { ...i, quantity } : i).filter(i => i.quantity > 0);
    setItems(newItems);
    saveToLocalStorage(newItems);
  };

  const removeItem = async (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    saveToLocalStorage(newItems);
  };

  const refreshCart = async () => {};

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      refreshCart,
      isPending,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

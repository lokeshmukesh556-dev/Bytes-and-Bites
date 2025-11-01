'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useMenu, type MenuItemWithId } from './MenuContext';

// The base item in the cart only needs to store what is unique to the cart.
export interface CartItemBase {
  id: string; // This will be the MenuItem's ID
  quantity: number;
}

// The full cart item, merged with live data from MenuContext.
export interface CartItem extends MenuItemWithId {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;
  subtotal: number;
  convenienceFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemBases, setCartItemBases] = useState<CartItemBase[]>([]);
  const { menuItems, isLoading: isMenuLoading } = useMenu();

  const cartItems = useMemo((): CartItem[] => {
    if (isMenuLoading) return [];

    const menuItemsById = new Map(menuItems.map(item => [item.id, item]));

    return cartItemBases.map(cartBase => {
        const menuItem = menuItemsById.get(cartBase.id);
        // If a menu item is deleted by an admin while it's in a cart, it will be filtered out here.
        if (!menuItem) return null;

        return {
          ...menuItem,
          quantity: cartBase.quantity,
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartItemBases, menuItems, isMenuLoading]);


  const addToCart = (itemId: string) => {
    setCartItemBases((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { id: itemId, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItemBases((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCartItemBases((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItemBase => item !== null)
    );
  };
  
  const clearCart = () => {
    setCartItemBases([]);
  };

  const { subtotal, total, convenienceFee } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const convenienceFee = subtotal > 0 ? 1.0 : 0;
    const total = subtotal + convenienceFee;
    return { subtotal, total, convenienceFee };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, convenienceFee, total }}
    >
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

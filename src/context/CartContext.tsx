
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useMenu, type MenuItemWithId } from './MenuContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const menuItemsById = useMemo(() => {
    if (isMenuLoading) return new Map();
    return new Map(menuItems.map((item) => [item.id, item]));
  }, [menuItems, isMenuLoading]);


  const cartItems = useMemo((): CartItem[] => {
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
  }, [cartItemBases, menuItemsById]);


  const addToCart = (itemId: string) => {
    const menuItem = menuItemsById.get(itemId);
    if (!menuItem) return;

    const existingItem = cartItemBases.find((i) => i.id === itemId);
    const currentQuantity = existingItem?.quantity || 0;

    if (currentQuantity >= menuItem.stock) {
      toast({
        variant: 'destructive',
        title: 'Stock Limit Reached',
        description: `You cannot add more of ${menuItem.name}.`,
      });
      return;
    }

    if (existingItem) {
      setCartItemBases((prevItems) =>
        prevItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItemBases((prevItems) => [...prevItems, { id: itemId, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItemBases((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    const menuItem = menuItemsById.get(itemId);
    if (!menuItem) return;

    const existingItemBase = cartItemBases.find(i => i.id === itemId);
    if (!existingItemBase) return;

    const newQuantity = existingItemBase.quantity + change;
    
    if (change > 0 && newQuantity > menuItem.stock) {
        toast({
            variant: 'destructive',
            title: 'Stock Limit Reached',
            description: `Only ${menuItem.stock} of ${menuItem.name} available.`,
        });
        return; // Exit without changing state
    }

    if (newQuantity > 0) {
      setCartItemBases(prevItems =>
        prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      removeFromCart(itemId);
    }
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

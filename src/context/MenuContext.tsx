'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { menuItems as initialMenuItems, type MenuItem } from '@/lib/data';

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  getMeals: () => MenuItem[];
  getSnacks: () => MenuItem[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };
  
  const getMeals = () => {
    return menuItems.filter(item => item.category === 'meal');
  }

  const getSnacks = () => {
    return menuItems.filter(item => item.category === 'snack');
  }

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, getMeals, getSnacks }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useCollection, useFirestore, WithId, useUser } from '@/firebase';
import { menuItems as initialMenuItems, type MenuItem } from '@/lib/data';
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useMemoFirebase } from '@/firebase/provider';

// Redefine MenuItem to use imageUrl directly
export interface MenuItemData extends Omit<MenuItem, 'id' | 'image'> {
  name: string;
  price: number;
  category: 'meal' | 'snack';
  imageUrl: string;
  imageHint: string;
  description: string;
}

export type MenuItemWithId = WithId<MenuItemData>;

interface MenuContextType {
  menuItems: MenuItemWithId[];
  addMenuItem: (item: MenuItemData) => void;
  updateMenuItem: (id: string, item: Partial<MenuItemData>) => void;
  deleteMenuItem: (itemId: string) => void;
  getMeals: () => MenuItemWithId[];
  getSnacks: () => MenuItemWithId[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const menuItemsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'menu_items') : null),
    [firestore]
  );

  const { data: menuItems, isLoading: isMenuLoading } =
    useCollection<MenuItemData>(menuItemsCollection);

  // Seed initial data if the collection is empty
  useEffect(() => {
    // We need to wait for auth to be resolved and for the menu items to be loaded
    if (isUserLoading || isMenuLoading || !firestore) {
      return;
    }

    if (user && menuItems && menuItems.length === 0) {
      initialMenuItems.forEach((item) => {
        const { id, image, ...rest } = item;
        const newItemData: MenuItemData = {
          ...rest,
          imageUrl: image.imageUrl,
          imageHint: image.imageHint,
        };
        addDocumentNonBlocking(
          collection(firestore, 'menu_items'),
          newItemData
        );
      });
    }
  }, [user, menuItems, isMenuLoading, isUserLoading, firestore]);

  const addMenuItem = (item: MenuItemData) => {
    if (!firestore) return;
    addDocumentNonBlocking(collection(firestore, 'menu_items'), item);
  };

  const updateMenuItem = (id: string, updatedItem: Partial<MenuItemData>) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'menu_items', id);
    updateDocumentNonBlocking(docRef, updatedItem);
  };

  const deleteMenuItem = (itemId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'menu_items', itemId);
    deleteDocumentNonBlocking(docRef);
  };

  const getMeals = () => {
    return menuItems?.filter((item) => item.category === 'meal') || [];
  };

  const getSnacks = () => {
    return menuItems?.filter((item) => item.category === 'snack') || [];
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems: menuItems || [],
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMeals,
        getSnacks,
        isLoading: isMenuLoading || isUserLoading,
      }}
    >
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

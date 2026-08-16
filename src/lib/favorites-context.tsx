'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Store } from '@/types';

interface FavoritesContextType {
  favoriteProductIds: string[];
  favoriteStoreIds: string[];
  toggleProductFavorite: (product: Product) => void;
  toggleStoreFavorite: (store: Store) => void;
  isProductFavorite: (productId: string) => boolean;
  isStoreFavorite: (storeId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [favoriteStoreIds, setFavoriteStoreIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProds = localStorage.getItem('descubra_artes_fav_products');
      const savedStores = localStorage.getItem('descubra_artes_fav_stores');
      if (savedProds) setFavoriteProductIds(JSON.parse(savedProds));
      if (savedStores) setFavoriteStoreIds(JSON.parse(savedStores));
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const toggleProductFavorite = (product: Product) => {
    setFavoriteProductIds(prev => {
      const exists = prev.includes(product.id);
      const next = exists ? prev.filter(id => id !== product.id) : [...prev, product.id];
      try {
        localStorage.setItem('descubra_artes_fav_products', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleStoreFavorite = (store: Store) => {
    setFavoriteStoreIds(prev => {
      const exists = prev.includes(store.id);
      const next = exists ? prev.filter(id => id !== store.id) : [...prev, store.id];
      try {
        localStorage.setItem('descubra_artes_fav_stores', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isProductFavorite = (productId: string) => favoriteProductIds.includes(productId);
  const isStoreFavorite = (storeId: string) => favoriteStoreIds.includes(storeId);

  const favoritesCount = favoriteProductIds.length + favoriteStoreIds.length;

  return (
    <FavoritesContext.Provider
      value={{
        favoriteProductIds,
        favoriteStoreIds,
        toggleProductFavorite,
        toggleStoreFavorite,
        isProductFavorite,
        isStoreFavorite,
        favoritesCount: isLoaded ? favoritesCount : 0,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

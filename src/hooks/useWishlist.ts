"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/types";

const WISHLIST_KEY = "rentnest_wishlist";

export function useWishlist() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial state from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setSavedProperties(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wishlist from local storage", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to local storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(savedProperties));
    }
  }, [savedProperties, isInitialized]);

  const toggleSave = (property: Property) => {
    setSavedProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      return [...prev, property];
    });
  };

  const isSaved = (propertyId: string) => {
    return savedProperties.some((p) => p.id === propertyId);
  };

  return {
    savedProperties,
    toggleSave,
    isSaved,
    isInitialized,
  };
}

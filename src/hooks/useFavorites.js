import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kanen:favorites";

function loadStoredIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Owns the favorites list and keeps it in sync with localStorage,
 * so bewaarde recepten overleven een refresh/herstart.
 */
export function useFavorites(allRecipes) {
  const [favoriteIds, setFavoriteIds] = useState(loadStoredIds);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // storage unavailable (e.g. private browsing) — fail silently
    }
  }, [favoriteIds]);

  const favorites = favoriteIds
    .map(id => allRecipes.find(r => r.id === id))
    .filter(Boolean);

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);

  const addFavorite = useCallback((id) => {
    setFavoriteIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavoriteIds(prev => prev.filter(fid => fid !== id));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  }, []);

  return { favorites, favoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}

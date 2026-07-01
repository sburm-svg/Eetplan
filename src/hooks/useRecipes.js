import { useState, useEffect, useCallback } from "react";
import { filterRecipes } from "../services/recipeService.js";
import { rankRecipes } from "../utils/scoring.js";

/**
 * Owns the swipe deck: builds it from preferences, and removes cards
 * from the top as the person swipes.
 */
export function useRecipes(preferences) {
  const [deck, setDeck] = useState(() => rankRecipes(filterRecipes(preferences), preferences));

  // Rebuild the deck whenever the person's preferences change
  useEffect(() => {
    setDeck(rankRecipes(filterRecipes(preferences), preferences));
  }, [preferences]);

  // Haalt een recept uit het deck
  const popRecipe = useCallback((id) => {
    setDeck(prev => prev.filter(r => r.id !== id));
  }, []);

  // VOEG DIT TOE: Zet een recept weer terug bovenaan het deck
  const pushRecipe = useCallback((recipe) => {
    setDeck(prev => [recipe, ...prev]);
  }, []);

  const resetDeck = useCallback(() => {
    setDeck(rankRecipes(filterRecipes(preferences), preferences));
  }, [preferences]);

  // Geef pushRecipe hieronder ook mee aan de return!
  return { deck, popRecipe, pushRecipe, resetDeck };
}

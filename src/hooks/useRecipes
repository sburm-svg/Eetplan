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
  // (e.g. after finishing onboarding or changing settings).
  useEffect(() => {
    setDeck(rankRecipes(filterRecipes(preferences), preferences));
  }, [preferences]);

  const popRecipe = useCallback((id) => {
    setDeck(prev => prev.filter(r => r.id !== id));
  }, []);

  const resetDeck = useCallback(() => {
    setDeck(rankRecipes(filterRecipes(preferences), preferences));
  }, [preferences]);

  return { deck, popRecipe, resetDeck };
}
